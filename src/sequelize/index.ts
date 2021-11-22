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
        defaultValue: '',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      universityName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      biddingPoint: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      profileImageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      isAuth: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
        type: DataTypes.UUID,
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
        type: DataTypes.UUID,
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
        type: DataTypes.UUID,
        allowNull: false,
      },
      bookPostID: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isHighest: {
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
        defaultValue: '',
      },
      isbn: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      authors: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
      publisher: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      salePrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
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
        type: DataTypes.UUID,
        allowNull: false,
      },
      userID: {
        type: DataTypes.UUID,
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
        type: DataTypes.UUID,
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
        type: DataTypes.UUID,
        allowNull: false,
      },
      bookPostID: {
        type: DataTypes.UUID,
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
        type: DataTypes.UUID,
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

  User.hasMany(BookPost, {
    foreignKey: 'userID',
    as: 'bookPostUserID',
  });
  BookPost.belongsTo(User, {
    foreignKey: 'userID',
    as: 'user',
  });
  InterestedPosts.belongsTo(BookPost, {
    foreignKey: 'bookPostID',
    as: 'interestedPost',
  });
  BidOrder.belongsTo(BookPost, {
    foreignKey: 'bookPostID',
    as: 'bookPost',
  });
  BookPost.hasMany(BidOrder, {
    foreignKey: 'bookPostID',
    as: 'bidOrder',
  });
  Auth.belongsTo(User, {
    foreignKey: 'userID',
    as: 'user',
  });
};

export { initSequelize };
