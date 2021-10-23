import { Model, Optional } from 'sequelize';

interface AuthAttributes {
  id: string;
  isAuth: boolean;
  userID: string;
  verificationCode: string;
  expirationTime: Date;
}

interface AuthCreationAttributes extends Optional<AuthAttributes, 'id'> {}

class Auth
  extends Model<AuthAttributes, AuthCreationAttributes>
  implements AuthAttributes
{
  public id!: string;
  public isAuth!: boolean;
  public userID!: string;
  public verificationCode!: string;
  public expirationTime!: Date;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export { AuthAttributes, Auth };
