/* eslint-disable @typescript-eslint/no-namespace */
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import CONF from './config';
import { User } from './db';

import AuthRouter from './router/auth';
import BoardRouter from './router/board';
import ArticleRouter from './router/article';
import CommentRouter from './router/comment';
import StaticsRouter from './router/statics';
import { needAuth, asyncHandler } from './middlewares';

const app = express();
app.use(helmet());
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: CONF.allowOrigins, credentials: true }));

app.use('/auth', AuthRouter);
app.use('/boards', BoardRouter);
app.use('/articles', ArticleRouter);
app.use('/comments', CommentRouter);
app.use('/statics', StaticsRouter);

app.get(
  '/me',
  needAuth,
  asyncHandler(async (req, res) => {
    res.json({ success: true, me: await User.findByPk(req.auth.id) });
  }),
);

app.listen(CONF.web.port, () => {
  console.log('start server');
});

declare global {
  namespace Express {
    interface Request {
      auth: {
        id: number;
        username: string;
      };
      realip: string;
    }
  }
}
