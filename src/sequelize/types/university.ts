import { Model, Optional } from 'sequelize';

interface UsersAttributes {
  id: string;
  name: string;
}

interface UsersCreationAttributes extends Optional<UsersAttributes, 'id'> {}

class University
  extends Model<UsersAttributes, UsersCreationAttributes>
  implements UsersAttributes
{
  public id!: string;
  public name!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export { UsersAttributes, University };
