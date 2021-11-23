import express from 'express';
import {
  SERVER_PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  FRONT_END_URL,
  TOASTS_API_END_POINT,
  TOASTS_SECRET_KEY,
  SENDER_MAIL,
  TEST_RECEIVER_EMAIL,
} from './constant';
import { User } from './sequelize/types/user';
import { Book } from './sequelize/types/book';
import { initSequelize } from './sequelize/index';
import { BookPost } from './sequelize/types/bookpost';
import { runInNewContext } from 'vm';
import { InterestedPosts } from './sequelize/types/interestedposts';
import { BidOrder } from './sequelize/types/bidorder';
import crypto from 'crypto';
import fetch from 'cross-fetch';
import { Auth } from './sequelize/types/auth';
import { isJSDocAuthorTag } from 'typescript';
require('dotenv').config();

const app = express();
const port = SERVER_PORT;
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const moment = require('moment');

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
  const {
    email,
    password,
    name,
    address,
    universityName,
    point,
    biddingPoint,
    profileImageUrl,
    isAuth,
  }: {
    email: string;
    password: string;
    name: string;
    address: string;
    universityName: string;
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
    universityName,
    point,
    biddingPoint,
    profileImageUrl,
    isAuth: false,
  });

  const expirationTime = moment().add(6, 'h');
  const token = crypto.randomBytes(16).toString('hex');

  const body = {
    senderAddress: SENDER_MAIL,
    title: '이메일 인증 안내',
    body: `<h2 style=\"padding-bottom: 10px; color: rgb(0, 0, 0); sans-serif; font-size: 22px; border-bottom: 4px solid rgb(68, 68, 68);\">이메일 인증</h2>
            <p style=\"margin-top: 30px; margin-bottom: 30px; padding-bottom: 40px; font-family: 돋움, Dotum, Helvetica, &quot;Apple SD Gothic Neo&quot;, sans-serif; font-size: 12px; border-bottom: 1px solid rgb(204, 204, 204);\">
                ${
                  user.email // user.email
                }님, 안녕하세요.
                <br>
                책바다 이메일 인증 안내 메일입니다. 
                <br>
                이메일 주소 인증은 6시간동안 유효합니다.
                <br>
                아래 이메일 주소 인증하기를 통해 인증을 할 수 있습니다.
                <br>
                <br>
                <a href=\"${FRONT_END_URL}/EmailVerification/${token}\" rel=\"noreferrer noopener\" target=\"_blank\" style=\"background: rgb(68, 68, 68); display: inline-block; color: rgb(255, 255, 255); font-weight: bold; text-align: center; padding: 20px 30px;\">
                이메일 주소 인증하기</a>
                <br>
                <br>
                이 메일 주소 인증절차는 회원님의 계정 정보를 보호하기 위해 꼭 거쳐야하는 절차임을 알려드립니다.
                <br>
                감사합니다.
            </p>"`,
    receiverList: [
      {
        receiveMailAddr: user.email, // user.email
        receiveType: 'MRT0',
      },
    ],
  };

  await fetch(TOASTS_API_END_POINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Secret-Key': TOASTS_SECRET_KEY,
    },
    body: JSON.stringify(body),
  });

  const auth = await Auth.create({
    userID: user.id,
    verificationCode: token,
    expirationTime: expirationTime,
    isAuth: user.isAuth,
  });

  res.send(user);
});

app.post('/signUp/verification', async (req: any, res) => {
  const { token }: { token: string } = req.query;
  const auth = await Auth.findOne({
    where: { verificationCode: token },
    include: {
      model: User,
      as: 'user',
    },
  });
  if (!auth) {
    console.log('verification code 가 없습니다.');
    res.send(false);
    return;
  }

  const now = new Date();
  const expirationTime = auth.expirationTime;
  const isExpiration = moment(expirationTime).isBefore(now); // isExpiration이 true면 유효시간 지남
  if (isExpiration) {
    res.send(false);
  }
  await Auth.update(
    {
      isAuth: true,
    },
    {
      where: { userID: auth.userID },
    },
  );
  await User.update(
    {
      isAuth: true,
    },
    {
      where: { id: auth.userID },
    },
  );
  res.send(true);
});

app.get('/signUp/email-check', async (req: any, res) => {
  const { email }: { email: string } = req.query;
  const user = await User.findOne({ where: { email } });

  if (user) {
    if (user.isAuth == true) {
      return res.send(false);
    }
    return res.send(true);
  }
  return res.send(true);
});

app.get('/signIn', async (req: any, res) => {
  const { email, password }: { email: string; password: string } = req.query;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    res.status(403).send(new Error('등록되지 않은 이메일입니다.'));
    return;
  }

  const isMatch = await bcrypt.compare(password, user!.password);
  if (!isMatch) {
    return res.status(403).send(new Error('비밀번호가 틀렸습니다.'));
  }

  try {
    // jwt.sign(): 토큰 발급
    const token = jwt.sign(
      {
        email: user.email,
        id: user.id,
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
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      message: '서버 에러',
    });
  }
});

// isbn 으로 책 구분, 이미 디비에 있으면 true, 없으면 생성하고 false
app.post('/bookPost/isBookinDB', async (req: any, res) => {
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

  const book = await Book.findOne({ where: { isbn } });

  if (book) {
    res.send(book);
    return;
  }

  const createdBook = await Book.create({
    title,
    isbn,
    datetime,
    authors,
    publisher,
    price,
    salePrice,
    thumbnail,
  });

  res.send(createdBook);
  return;
});

app.post('/bookPost/write', async (req: any, res) => {
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
  const { isActive }: { isActive: string } = req.query;

  const where = {};
  if (isActive !== undefined) {
    Object.assign(where, {
      isActive: isActive === 'true' ? true : false,
    });
  }

  const bookPosts = await BookPost.findAll({
    where,
    order: [['createdAt', 'DESC']],
    include: [
      {
        attributes: ['name'],
        as: 'user',
        model: User,
      },
    ],
  });
  res.send(bookPosts);
});

// 관심 많은 글 = hottest
app.get('/bookPostList/hot', async (req: any, res) => {
  const { isActive }: { isActive: string } = req.query;

  const where = {};
  if (isActive !== undefined) {
    Object.assign(where, {
      isActive: isActive === 'true' ? true : false,
    });
  }

  const bookPosts = await BookPost.findAll({
    where,
    include: {
      model: User,
      attributes: ['name'],
      as: 'user',
    },
    order: [['interestedCounts', 'DESC']],
  });
  res.send(bookPosts);
});

// 전체글에 이 책을 판매하는 글이 있는가
app.get('/bookPost/searchBook', async (req: any, res) => {
  const { searchWord }: { searchWord: string } = req.query;
  const searchedBookPosts = await BookPost.findAll({
    include: [
      {
        model: User,
        attributes: ['name'],
        as: 'user',
      },
    ],
    where: {
      title: { [Op.like]: '%' + searchWord + '%' },
    },
    order: [['createdAt', 'ASC']],
  });
  res.send(searchedBookPosts);
});

// 상세페이지
app.get('/bookPost/post', async (req: any, res) => {
  const { bookPostID }: { bookPostID: string } = req.query;

  const post = await BookPost.findOne({
    where: { id: bookPostID },
    include: [
      {
        attributes: ['name'],
        as: 'user',
        model: User,
      },
    ],
  });
  res.send(post);
});

// 찜
app.post('/bookPost/post/interestedCount', async (req: any, res) => {
  const { bookPostID, userID }: { bookPostID: string; userID: string } =
    req.query;

  const bookPost = await BookPost.findOne({
    where: { id: bookPostID },
  });

  if (!bookPost) {
    return;
  }

  const user = await User.findOne({
    where: {
      id: userID,
    },
  });
  if (!user) {
    return;
  }

  //bookPost.interestedCounts;
  const interestedPosts = await InterestedPosts.findOne({
    where: {
      bookPostID: bookPost.id,
      userID: user.id,
    },
  });

  if (!interestedPosts) {
    await BookPost.update(
      {
        interestedCounts: bookPost.interestedCounts + 1,
      },
      {
        where: {
          id: bookPostID,
        },
      },
    );
    const interestedPosts = await InterestedPosts.create({
      userID: userID,
      bookPostID: bookPost.id,
    });
    return;
  }

  await BookPost.update(
    {
      interestedCounts: bookPost.interestedCounts - 1,
    },
    {
      where: {
        id: bookPostID,
      },
    },
  );

  await InterestedPosts.destroy({
    where: {
      bookPostID: bookPost.id,
      userID: user.id,
    },
  });
});

app.get('/user', async (req: any, res) => {
  const { id }: { id: string } = req.query;

  const user = await User.findOne({
    where: {
      id,
    },
  });

  res.send(user);
  return;
});

app.put('/bidBookPost', async (req: any, res) => {
  const {
    bookPostID,
    userID,
    bidPrice,
  }: {
    bookPostID: string;
    userID: string;
    bidPrice: string;
  } = req.query;

  const user = await User.findOne({
    where: {
      id: userID,
    },
  });
  const bookPost = await BookPost.findOne({
    where: {
      id: bookPostID,
    },
  });

  if (!user || !bookPost) {
    console.log('설마 여기에요?');
    res.send(false);
    return;
  }

  const useablePoint = user.point - user.biddingPoint;
  const isPayable = useablePoint > Number(bidPrice);
  if (!isPayable) {
    res.send(false);
    return;
  }

  const isBiddingBookPost = bookPost.bidPrice > 0;
  if (isBiddingBookPost) {
    const result = await BidOrder.update(
      {
        bookPostID,
        isHighest: false,
      },
      {
        where: {
          bookPostID,
          isHighest: true,
        },
        returning: true,
      },
    );

    if (!result) {
      res.send(false);
      return;
    }
    const failBidOrder = result[1][0];
    const failBidUser = await User.findOne({
      where: {
        id: failBidOrder.userID,
      },
    });
    if (!failBidUser) {
      res.send(false);
      return;
    }
    await User.update(
      {
        biddingPoint: failBidUser.biddingPoint - failBidOrder.point,
      },
      {
        where: {
          id: failBidOrder.userID,
        },
      },
    );
  }

  await BidOrder.create({
    userID,
    bookPostID,
    point: Number(bidPrice),
    isHighest: true,
  });
  await User.update(
    {
      biddingPoint: user.biddingPoint + Number(bidPrice),
    },
    {
      where: {
        id: userID,
      },
    },
  );
  await BookPost.update(
    {
      bidPrice: Number(bidPrice),
    },
    {
      where: {
        id: bookPostID,
      },
    },
  );

  res.send(true);
  return;
});

app.put('/buyImmediatelyBookPost', async (req: any, res) => {
  const {
    bookPostID,
    userID,
  }: {
    bookPostID: string;
    userID: string;
  } = req.query;

  const user = await User.findOne({
    where: {
      id: userID,
    },
  });
  const bookPost = await BookPost.findOne({
    where: {
      id: bookPostID,
    },
  });

  if (!user || !bookPost) {
    res.send(false);
    return;
  }

  const useablePoint = user.point - user.biddingPoint;
  const isPayable = useablePoint > Number(bookPost.buyingItNowPrice);
  if (!isPayable) {
    res.send(false);
    return;
  }

  const isBiddingBookPost = bookPost.bidPrice > 0;
  if (isBiddingBookPost) {
    const result = await BidOrder.update(
      {
        bookPostID,
        isHighest: false,
      },
      {
        where: {
          bookPostID,
          isHighest: true,
        },
        returning: true,
      },
    );

    if (!result) {
      res.send(false);
      return;
    }
    const failBidOrder = result[1][0];
    const failBidUser = await User.findOne({
      where: {
        id: failBidOrder.userID,
      },
    });
    if (!failBidUser) {
      res.send(false);
      return;
    }
    await User.update(
      {
        biddingPoint: failBidUser.biddingPoint - failBidOrder.point,
      },
      {
        where: {
          id: failBidOrder.userID,
        },
      },
    );
  }

  await BidOrder.create({
    userID,
    bookPostID,
    point: Number(bookPost.buyingItNowPrice),
    isHighest: true,
  });
  await User.update(
    {
      point: user.point - Number(bookPost.buyingItNowPrice),
    },
    {
      where: {
        id: userID,
      },
    },
  );
  await BookPost.update(
    {
      bidPrice: Number(bookPost.buyingItNowPrice),
      isActive: false,
    },
    {
      where: {
        id: bookPostID,
      },
    },
  );

  res.send(true);
  return;
});

// 관심글 가져오는 api
app.get('/mypage/list/interest', async (req: any, res) => {
  const { userID }: { userID: string } = req.query;
  const interestedPost = await InterestedPosts.findAll({
    where: {
      userID: userID,
    },
    include: {
      model: BookPost,
      as: 'interestedPost',
    },
  });
  if (!interestedPost) {
    console.log('no interested posts');
    return;
  }

  console.log(interestedPost);
  res.send(interestedPost);
});

// 구매목록 가져오는 api
app.get('/mypage/list/purchase', async (req: any, res) => {
  const { userID }: { userID: string } = req.query;
  const purchasedBookpost = await BidOrder.findAll({
    where: {
      userID: userID,
      isHighest: true,
    },
    include: {
      model: BookPost,
      as: 'bookPost',
      where: {
        isActive: false,
      },
    },
  });

  if (!purchasedBookpost) {
    console.log('no purchased book posts');
    return;
  }

  res.send(purchasedBookpost);
});

// 입찰 참여 목록 가져오는 api
app.get('/mypage/list/bid', async (req: any, res) => {
  const { userID }: { userID: string } = req.query;
  const biddingBookpost = await BidOrder.findAll({
    where: {
      userID: userID,
    },
    include: {
      model: BookPost,
      as: 'bookPost',
      where: {
        isActive: true,
      },
    },
  });

  if (!biddingBookpost) {
    console.log('no bidded book posts');
    return;
  }
  res.send(biddingBookpost);
});

app.listen(port, () => {
  console.log('backend server listen');
});
app.get('/', async (req, res) => {
  res.send('hello');
});
