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
import { Comment, User, Board } from '.';

interface ArticleAttributes {
  id: number;
  userId: number;
  boardId: number;
  title: string;
  content: string;
}

type ArticleCreationAttributes = Optional<ArticleAttributes, 'id'>;

export class Article extends Model<ArticleAttributes, ArticleCreationAttributes>
  implements ArticleAttributes {
  public id!: number;
  public userId!: number;
  public boardId!: number;
  public title!: string;
  public content!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getComments!: HasManyGetAssociationsMixin<Comment>;
  public addComment!: HasManyAddAssociationMixin<Comment, number>;
  public hasComment!: HasManyHasAssociationMixin<Comment, number>;
  public countComments!: HasManyCountAssociationsMixin;
  public createComment!: HasManyCreateAssociationMixin<Comment>;

  public readonly comments?: Comment[];
  public readonly writer?: User;
  public readonly board?: Board;

  public static associations: {
    comments: Association<Article, Comment>;
    writer: Association<Article, User>;
    board: Association<Article, Board>;
  };
}

export const ArticleInit = (sequelize: Sequelize): void => {
  Article.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      boardId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      title: {
        type: new DataTypes.STRING(20),
        allowNull: false,
      },
      content: {
        type: new DataTypes.TEXT('long'),
        allowNull: false,
      },
    },
    {
      tableName: 'articles',
      sequelize,
    },
  );
  Article.hasMany(Comment, {
    sourceKey: 'id',
    foreignKey: 'articleId',
    as: 'comments',
  });
};
