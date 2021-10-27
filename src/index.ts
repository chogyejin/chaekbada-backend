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

const tokenRouter = require('./routes/token.ts');

const app = express();
const port = SERVER_PORT;

const { Client } = require('pg');

const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

client.connect();

initSequelize();

app.get('/user/1', async (req: any, res) => {
  console.log('user');
  const { name }: { name: string } = req.query;
  const user = await User.findOne({ where: { name } });
  console.log(user);
  const test = await User.findAll();
  console.log(test);
  if (test) {
    console.log(test);
    return res.send({ test: test });
  }
});

app.get('/', async (req, res) => {
  //const test = await Test.findAll();
  //console.log(test);
  //if (test) {
  //  return res.send({ test: test });
  //}
  res.send('hello');
});

app.listen(port, () => {
  console.log('backend server listen');
  console.log(process.env.JWT_SECRET);
});

app.use('/token', tokenRouter);
// app.use(verifyToken());
//app.use(빈칸?) 모든 api 요청에 대해 오른쪽 함수를 실행하는
