import { Model, Optional } from 'sequelize';

interface UsersAttributes {
  id: string;
  userID: string;
  bookPostID: string;
}

interface UsersCreationAttributes extends Optional<UsersAttributes, 'id'> {}

class InterestedPosts
  extends Model<UsersAttributes, UsersCreationAttributes>
  implements UsersAttributes
{
  public id!: string;
  public userID!: string;
  public bookPostID!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export { UsersAttributes, InterestedPosts };
