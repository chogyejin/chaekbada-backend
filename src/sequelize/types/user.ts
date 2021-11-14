import { Model, Optional } from 'sequelize';

interface UsersAttributes {
  id: string;
  email: string;
  password: string;
  name: string;
  universityName: string;
  address: string;
  point: number;
  biddingPoint: number;
  profileImageUrl: string;
  isAuth: boolean;
}

interface UsersCreationAttributes extends Optional<UsersAttributes, 'id'> {}

class User
  extends Model<UsersAttributes, UsersCreationAttributes>
  implements UsersAttributes
{
  public id!: string;
  public email!: string;
  public password!: string;
  public name!: string;
  public universityName!: string;
  public address!: string;
  public point!: number;
  public biddingPoint!: number;
  public profileImageUrl!: string;
  public isAuth!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export { UsersAttributes, User };
