export const IS_PRODUCTION =
  process.env.NODE_ENV === 'production' ? true : false;

const SERVER_PORT = IS_PRODUCTION ? 8081 : 4000;

const DB_PORT = 5432;
const DB_HOST = IS_PRODUCTION ? 'chaekbada.cfgblzfndycn.ap-northeast-2.rds.amazonaws.com' : '127.0.0.1';
const DB_USER = 'chaekbada';
const DB_PASSWORD = IS_PRODUCTION ? "12341234":'1234';
const DB_NAME = 'chaekbada';

const SENDER_MAIL = 'rezzo@dkuh.co.kr';
const FRONT_END_URL = IS_PRODUCTION ? 'Chaekbadauser-env.eba-6etkpnv3.ap-northeast-2.elasticbeanstalk.com' : 'http://localhost:3000';
const TEST_RECEIVER_EMAIL = 'beewt@naver.com';
const TOASTS_APP_KEY = 'zcClkQzLxt0Pf3Oh';
const TOASTS_SECRET_KEY = 'Fq7Qh1iV';
const TOASTS_API_END_POINT = `https://api-mail.cloud.toast.com/email/v2.0/appKeys/${TOASTS_APP_KEY}/sender/mail`;

export {
  DB_PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  SERVER_PORT,
  SENDER_MAIL,
  FRONT_END_URL,
  TEST_RECEIVER_EMAIL,
  TOASTS_APP_KEY,
  TOASTS_SECRET_KEY,
  TOASTS_API_END_POINT,
};
