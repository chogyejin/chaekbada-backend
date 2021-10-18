import { Model, Optional } from 'sequelize';

interface UsersAttributes {
  id: string;
  title: string;
  contents: string;
  bookID: string;
  userID: string;
}

interface UsersCreationAttributes extends Optional<UsersAttributes, 'id'> {}

class SolutionPost
  extends Model<UsersAttributes, UsersCreationAttributes>
  implements UsersAttributes
{
  public id!: string;
  public title!: string;
  public contents!: string;
  public bookID!: string;
  public userID!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export { UsersAttributes, SolutionPost };
