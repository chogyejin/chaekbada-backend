const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { verifyToken } = require('./middlewares.ts');

const router = express.Router();

// 토큰 발급 라우터
router.post('/', async (req, res) => {
  try {
    // 대충 DB에서 사용자 정보를 찾는 코드: 대충 id, nick 정보를 찾았다고 가정
    const email = 'chogyejin@chogyejin.com';

    // jwt.sign(): 토큰 발급
    const token = jwt.sign(
      {
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '10m', // 10분
        issuer: '토큰 발급자',
      },
    );

    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다.',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

// 토큰 테스트 라우터
router.get('/test', verifyToken, (req, res) => {
  res.json(req.decoded);
});

module.exports = router;
