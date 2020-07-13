import { Sequelize } from 'sequelize';
import { User, UserInit } from './user';
import { Board, BoardInit } from './board';
import { Article, ArticleInit } from './article';
import { Comment, CommentInit } from './comment';
import CONF from '../config';

const sequelize = new Sequelize(CONF.db as any);

CommentInit(sequelize);
ArticleInit(sequelize);
BoardInit(sequelize);
UserInit(sequelize);
sequelize.sync({ alter: true });

export { User, Board, Article, Comment };
