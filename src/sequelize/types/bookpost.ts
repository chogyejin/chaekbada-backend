import { Model, Optional } from 'sequelize';

interface UsersAttributes {
  id: string;
  bookID: string;
  title: string;
  contents: string;
  userID: string;
  interestedCounts: number;
  endDate: Date;
  bidPrice: number;
  buyingItNowPrice: number;
  reservePrice: number;
  bookImageUrl: string;
  isActive: boolean;
  thumbnail: string;
}

interface UsersCreationAttributes extends Optional<UsersAttributes, 'id'> {}

class BookPost
  extends Model<UsersAttributes, UsersCreationAttributes>
  implements UsersAttributes
{
  public id!: string;
  public bookID!: string;
  public title!: string;
  public contents!: string;
  public userID!: string;
  public interestedCounts!: number;
  public endDate!: Date;
  public bidPrice!: number;
  public buyingItNowPrice!: number;
  public reservePrice!: number;
  public bookImageUrl!: string;
  public isActive!: boolean;
  public thumbnail!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export { UsersAttributes, BookPost };
