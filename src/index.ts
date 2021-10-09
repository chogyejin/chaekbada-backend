import express from 'express';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from './constant';
import { Users } from './sequelize/types/user';
import { Test } from './sequelize/types/test';
import { initSequelize } from './sequelize/index';

const app = express();
const port = 3000;

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

app.get('api/getpPwd', async (req: any, res) => {
  console.log('get password');
  const { name }: { name: string } = req.query;
  const user = await Users.findOne({ where: { name } });
  console.log(user);
  if (!user) {
    return res
      .status(403)
      .send(new Error('입력하신 정보가 존재하지 않습니다.'));
  } else {
    return res.send({ password: user });
  }
});

app.get('/', async (req, res) => {
  const test = await Test.findAll();
  console.log(test);
  if (test) {
    return res.send({ test: test });
  }
});

app.listen(port, () => {
  console.log('backend server listen');
});
