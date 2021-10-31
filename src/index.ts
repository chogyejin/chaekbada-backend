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
import { initSequelize } from './sequelize/index';
require('dotenv').config();

const app = express();
const port = SERVER_PORT;
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');

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

app.use((req: any, res) => {
  try {
    // 모든 API 요청, 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰 반환
    console.log(req.headers.authorization);
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return res.send(true);
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.',
      });
    }

    // 토큰의 비밀키가 일치하지 않는 경우
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.',
    });
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

  res.header('Access-Control-Allow-Origin', '*'); //CORS 에러 해결 헤더 전달
  res.header('Access-Control-Allow-Headers', '*');
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

// app.get('/signIn', async (req: any, res) => {
//   console.log('로그인 api');
//   const { email, password }: { email: string; password: string } = req.query;
//   const user = await User.findOne({ where: { email } });

//   if (user) {
//     const isMatch = await bcrypt.compare(password, user!.password);
//     if (!isMatch) {
//       return res.status(403).send(new Error('비밀번호가 틀렸습니다.'));
//     }
//   } else {
//     return res.status(403).send(new Error('등록되지 않은 이메일입니다.'));
//   }

//   return res.send({ user: user });
// });

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
        expiresIn: '10m', // 10분
        issuer: '토큰 발급자',
        scope: '',
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

app.get('/', async (req, res) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log('backend server listen');
});
