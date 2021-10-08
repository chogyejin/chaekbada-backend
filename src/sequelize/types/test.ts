import { Sequelize, Model, Optional } from 'sequelize';

interface TestAttributes {
  password: string;
  name: string;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface TestCreationAttributes extends Optional<TestAttributes, 'name'> {}

class Test
  extends Model<TestAttributes, TestCreationAttributes>
  implements TestAttributes
{
  public password!: string;
  public name!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export { TestAttributes, Test };
