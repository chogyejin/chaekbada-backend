import { Model, Optional } from 'sequelize';

interface UsersAttributes {
  id: string;
  userID: string;
  bookPostID: string;
  point: number;
  isHighest: boolean;
}

interface UsersCreationAttributes extends Optional<UsersAttributes, 'id'> {}

class BidOrder
  extends Model<UsersAttributes, UsersCreationAttributes>
  implements UsersAttributes
{
  public id!: string;
  public userID!: string;
  public bookPostID!: string;
  public point!: number;
  public isHighest!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export { UsersAttributes, BidOrder };
