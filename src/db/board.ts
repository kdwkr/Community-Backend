import {
  Model,
  Optional,
  DataTypes,
  Sequelize,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import { BoardTypes } from '../types/board';
import { Article } from '.';

interface BoardAttributes {
  id: number;
  name: string;
  desc: string;
  type: string;
}

type BoardCreationAttributes = Optional<BoardAttributes, 'id'>;

export class Board extends Model<BoardAttributes, BoardCreationAttributes>
  implements BoardAttributes {
  public id!: number;
  public name!: string;
  public desc!: string;
  public type!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getArticles!: HasManyGetAssociationsMixin<Article>;
  public addArticle!: HasManyAddAssociationMixin<Article, number>;
  public hasArticle!: HasManyHasAssociationMixin<Article, number>;
  public countArticles!: HasManyCountAssociationsMixin;
  public createArticle!: HasManyCreateAssociationMixin<Article>;

  public readonly articles?: Article[];

  public static associations: {
    articles: Association<Board, Article>;
  };
}

export const BoardInit = (sequelize: Sequelize): void => {
  Board.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(20),
        allowNull: false,
      },
      desc: {
        type: new DataTypes.STRING(200),
        allowNull: false,
      },
      type: {
        type: new DataTypes.ENUM(...BoardTypes),
        allowNull: false,
      },
    },
    {
      tableName: 'boards',
      sequelize,
    },
  );
  Board.hasMany(Article, {
    sourceKey: 'id',
    foreignKey: 'boardId',
    as: 'articles',
  });
};
