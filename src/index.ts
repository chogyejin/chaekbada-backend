import express from 'express';
import {
  SERVER_PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
} from './constant';
import { User } from './sequelize/types/user';
import { Book } from './sequelize/types/book';
import { initSequelize } from './sequelize/index';
import { BookPost } from './sequelize/types/bookpost';
import { runInNewContext } from 'vm';
require('dotenv').config();

const app = express();
const port = SERVER_PORT;
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

client.connect();

initSequelize();

app.use(cors());

app.use((req: any, res, next) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1]; // Authorization: 'Bearer TOKEN'
    console.log(req.headers);
    console.log(req.headers.authorization);
    console.log(req.query);
    if (!token) {
      throw new Error('Authentication failed!');
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (e: any) {
    res.status(400).send('Invalid token !');
  }
});

app.post('/signUp', async (req: any, res) => {
  console.log('회원가입 api');
  const {
    email,
    password,
    name,
    address,
    universityID,
    point,
    biddingPoint,
    profileImageUrl,
    isAuth,
  }: {
    email: string;
    password: string;
    name: string;
    address: string;
    universityID: string;
    point: number;
    biddingPoint: number;
    profileImageUrl: string;
    isAuth: boolean;
  } = req.query;

  const saltRounds = 11;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    address,
    universityID,
    point,
    biddingPoint,
    profileImageUrl,
    isAuth,
  });
  user.isAuth = false;

  res.send(user);
});

app.get('/signUp/email-check', async (req: any, res) => {
  console.log('email 중복체크 api');
  const { email }: { email: string } = req.query;
  const user = await User.findOne({ where: { email } });

  if (user) {
    return res.send(false);
  }
  return res.send(true);
});

app.get('/signIn', async (req: any, res) => {
  console.log('로그인 api');
  const { email, password }: { email: string; password: string } = req.query;
  const user = await User.findOne({ where: { email } });

  //예외
  if (user) {
    const isMatch = await bcrypt.compare(password, user!.password);
    if (!isMatch) {
      return res.status(403).send(new Error('비밀번호가 틀렸습니다.'));
    }
  } else {
    return res.status(403).send(new Error('등록되지 않은 이메일입니다.'));
  }

  try {
    // jwt.sign(): 토큰 발급
    const token = jwt.sign(
      {
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d', // 유효기간
        issuer: '토큰 발급자',
      },
    );
    return res.send({
      code: 200,
      message: '토큰이 발급되었습니다.',
      token,
      user: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: '서버 에러',
    });
  }
});

// isbn 으로 책 구분, 이미 디비에 있으면 true, 없으면 생성하고 false
app.post('/bookPost/isBookinDB', async (req: any, res) => {
  console.log('kakao book에서 호출하는 api');
  const {
    title,
    isbn,
    datetime,
    authors,
    publisher,
    price,
    salePrice,
    thumbnail,
  }: {
    title: string;
    isbn: string;
    datetime: Date;
    authors: string[];
    publisher: string;
    price: number;
    salePrice: number;
    thumbnail: string;
  } = req.query;

  // findOrCreate
  const book = await Book.findOne({ where: { isbn } });

  if (!book) {
    const book = await Book.create({
      title,
      isbn,
      datetime,
      authors,
      publisher,
      price,
      salePrice,
      thumbnail,
    });
  }
  const bookID = await Book.findOne({
    where: { isbn },
    attributes: ['id'],
  });
  res.send(bookID);
});

app.post('/bookPost/write', async (req: any, res) => {
  console.log('상품등록글 작성 api');
  const {
    bookID,
    title,
    contents,
    userID,
    endDate,
    reservePrice,
    buyingItNowPrice,
    bookImageUrl,
    thumbnail,
  }: {
    bookID: string;
    title: string;
    contents: string;
    userID: string;
    endDate: Date;
    reservePrice: number;
    buyingItNowPrice: number;
    bookImageUrl: string;
    thumbnail: string;
  } = req.query;

  const bidPrice = 0;
  const isActive = true;
  const interestedCounts = 0;

  const bookPost = await BookPost.create({
    bookID,
    title,
    contents,
    userID,
    interestedCounts,
    endDate,
    bidPrice,
    reservePrice,
    buyingItNowPrice,
    bookImageUrl,
    isActive,
    thumbnail,
  });

  res.send(bookPost);
});

// 최신순 bookPost
app.get('/bookPostList/new', async (req: any, res) => {
  console.log('판매글 최신순');
  const bookPosts = await BookPost.findAll({
    order: [['createdAt', 'ASC']],
  });
  res.send(bookPosts);
});

// 관심 많은 글 = hottest
app.get('/bookPostList/hot', async (req: any, res) => {
  console.log('판매글 인기순');
  const bookPosts = await BookPost.findAll({
    where: {},
    include: {
      model: User,
      attributes: ['name'],
      as: 'bookPostUserID',
    },
    order: [['interestedCounts', 'DESC']],
  });
  res.send(bookPosts);
});

// 전체글에 이 책을 판매하는 글이 있는가
// bookPost의 title, authors, buyingItNowPrice, bidPrice, endDate, userID로 User의 name
app.get('/bookPost/searchBook', async (req: any, res) => {
  const { searchWord }: { searchWord: string } = req.query;
  //let searchWord; searchWord = searchWord.trim();

  const searchedBookPosts = await BookPost.findAll({
    include: [
      /*{
        model: User,
        attributes: ['name'],
        as: 'user',
      },*/
    ],
    where: {
      // 검색 안되고 있음
      title: { [Op.like]: '%' + searchWord + '%' },
    },
    order: [['createdAt', 'ASC']],
  });
  console.log(searchedBookPosts);
  res.send(searchedBookPosts);
});

// 상세페이지
app.get('/bookPost/post', async (req: any, res) => {
  const { bookPostID }: { bookPostID: string } = req.query;

  const post = await BookPost.findAll({
    where: { id: bookPostID },
    attributes: [
      'title',
      'bookID',
      'contents',
      'userID',
      'interestedCounts',
      'endDate',
      'bidPrice',
      'buyingItNowPrice',
      'reservePrice',
      'bookImageUrl',
      'isActive',
      'thumbnail',
    ],
  });
  res.send(post);
});

app.get('/', async (req, res) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log('backend server listen');
});
