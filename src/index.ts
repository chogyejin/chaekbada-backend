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

const app = express();
const port = SERVER_PORT;
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const cors = require('cors');

const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

client.connect();

initSequelize();

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

  if (user) {
    const isMatch = await bcrypt.compare(password, user!.password);
    if (!isMatch) {
      return res.status(403).send(new Error('비밀번호가 틀렸습니다.'));
    }
  } else {
    return res.status(403).send(new Error('등록되지 않은 이메일입니다.'));
  }
  return res.send({ user: user });
});

app.get('/', async (req, res) => {
  res.send('hello');
});

app.listen(port, () => {
  console.log('backend server listen');
});

app.use(cors());
