import {
  Model,
  Optional,
  DataTypes,
  Sequelize,
  HasManyGetAssociationsMixin,
} from 'sequelize';

import { Article, Comment } from '.';

interface UserAttributes {
  id: number;
  username: string;
  password: string;
  nickname: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public username!: string;
  public password!: string;
  public nickname!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getArticles!: HasManyGetAssociationsMixin<Article>;
  public getComments!: HasManyGetAssociationsMixin<Comment>;

  public readonly articles?: Article[];
  public readonly comments?: Comment[];
}

export const UserInit = (sequelize: Sequelize): void => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: new DataTypes.STRING(15),
        primaryKey: true,
        allowNull: false,
      },
      password: {
        type: new DataTypes.CHAR(128),
        allowNull: true,
      },
      nickname: { type: new DataTypes.STRING(15), allowNull: false },
    },
    {
      tableName: 'users',
      sequelize,
    },
  );
  User.hasMany(Article, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'articles',
  });
  Article.belongsTo(User, {
    foreignKey: 'userId',
    as: 'writer',
  });
  User.hasMany(Comment, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'comments',
  });
  Comment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'writer',
  });
};
