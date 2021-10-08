import { Model, Optional } from 'sequelize';

interface UsersAttributes {
  id: string | null;
  email: string | null;
  password: string | null;
  name: string | null;
  address: string | null;
  zipCode: string | null;
  school: string | null;
  phoneNumber: string | null;
  birthDate: Date | null;
}

interface UsersCreationAttributes extends Optional<UsersAttributes, 'id'> {}

class Users
  extends Model<UsersAttributes, UsersCreationAttributes>
  implements UsersAttributes
{
  public id!: string | null; // Note that the `null assertion` `!` is required in strict mode.
  public email!: string | null;
  public password!: string | null;
  public name!: string | null;
  public address!: string | null;
  public zipCode!: string | null;
  public school!: string | null;
  public phoneNumber!: string | null;
  public birthDate!: Date | null;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export { UsersAttributes, Users };
