import { Model, Optional } from 'sequelize';

interface UsersAttributes {
  id: string;
  title: string;
  isbn: string;
  datetime: Date;
  authors: Array<string>;
  publisher: string;
  price: number;
  salePrice: number;
  thumbnail: string;
}

interface UsersCreationAttributes extends Optional<UsersAttributes, 'id'> {}

class Book
  extends Model<UsersAttributes, UsersCreationAttributes>
  implements UsersAttributes
{
  public id!: string;
  public title!: string;
  public isbn!: string;
  public datetime!: Date;
  public authors!: Array<string>;
  public publisher!: string;
  public price!: number;
  public salePrice!: number;
  public thumbnail!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export { UsersAttributes, Book };
