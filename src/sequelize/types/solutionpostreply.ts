import { Model, Optional } from 'sequelize';

interface UsersAttributes {
  id: string;
  solutionPostID: string;
  userID: string;
  contents: string;
}

interface UsersCreationAttributes extends Optional<UsersAttributes, 'id'> {}

class SolutionPostReply
  extends Model<UsersAttributes, UsersCreationAttributes>
  implements UsersAttributes
{
  public id!: string;
  public solutionPostID!: string;
  public userID!: string;
  public contents!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export { UsersAttributes, SolutionPostReply };
