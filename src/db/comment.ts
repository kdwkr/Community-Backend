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
import { User, Article } from '.';

interface CommentAttributes {
  id: number;
  userId: number;
  articleId: number;
  parentCommentId?: number;
  content: string;
}

type CommentCreationAttributes = Optional<CommentAttributes, 'id'>;

export class Comment extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes {
  public id!: number;
  public userId!: number;
  public articleId!: number;
  public parentCommentId?: number;
  public content!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getChildComments!: HasManyGetAssociationsMixin<Comment>;
  public addChildComment!: HasManyAddAssociationMixin<Comment, number>;
  public hasChildComment!: HasManyHasAssociationMixin<Comment, number>;
  public countChildComments!: HasManyCountAssociationsMixin;
  public createChildComment!: HasManyCreateAssociationMixin<Comment>;

  public readonly writer?: User;
  public readonly article?: Article;
  public readonly parentComment?: Comment;
  public readonly childComments?: Comment[];

  public static associations: {
    writer: Association<Comment, User>;
    article: Association<Comment, Article>;
    parentComment: Association<Comment, Comment>;
    childComments: Association<Comment, Comment>;
  };
}

export const CommentInit = (sequelize: Sequelize): void => {
  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      articleId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      parentCommentId: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      content: {
        type: new DataTypes.STRING(200),
        allowNull: false,
      },
    },
    {
      tableName: 'comments',
      sequelize,
    },
  );
  Comment.hasMany(Comment, {
    sourceKey: 'id',
    foreignKey: 'parentCommentId',
    as: 'childComments',
  });
  Comment.belongsTo(Comment, {
    foreignKey: 'parentCommentId',
    as: 'parentComment',
  });
};
