import { Sequelize, DataTypes } from 'sequelize';
import { User } from './types/user';
import { University } from './types/university';
import { BookPost } from './types/bookpost';
import { BidOrder } from './types/bidorder';
import { Book } from './types/book';
import { SolutionPost } from './types/solutionpost';
import { SolutionPostReply } from './types/solutionpostreply';
import { InterestedPosts } from './types/interestedposts';
import { Auth } from './types/auth';
import { DB_USER, DB_PASSWORD, DB_PORT, DB_NAME, DB_HOST } from '../constant';

const initSequelize = () => {
  const sequelize = new Sequelize(
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  );

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      universityID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      biddingPoint: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      profileImageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'User',
      sequelize, // passing the `sequelize` instance is required
    },
  );

  University.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'University',
      sequelize,
    },
  );

  BookPost.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      bookID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contents: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      interestedCounts: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      bidPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      buyingItNowPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reservePrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bookImageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'BookPost',
      sequelize,
    },
  );

  BidOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bookPostID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: 'BidOrder',
      sequelize,
    },
  );

  Book.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isbn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      datetime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      authors: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      publisher: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      salePrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'Book',
      sequelize,
    },
  );

  SolutionPost.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contents: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      bookID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'SolutionPost',
      sequelize,
    },
  );

  SolutionPostReply.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      solutionPostID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contents: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'SolutionPostReply',
      sequelize,
    },
  );

  InterestedPosts.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bookPostID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'InterestedPosts',
      sequelize,
    },
  );

  Auth.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      isAuth: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      userID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      verificationCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expirationTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: 'Auth',
      sequelize,
    },
  );

  User.belongsTo(University, {
    foreignKey: 'universityID',
    as: 'university',
  });
};

export { initSequelize };
