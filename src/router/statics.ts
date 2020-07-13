import { Router } from 'express';
import moment from 'moment';
import { Op } from 'sequelize';
import { asyncHandler, needAuth } from '../middlewares';
import { Article, Comment } from '../db';

const router = Router();

router.get(
  '/articlecount',
  asyncHandler(async (req, res) => {
    const start = moment().startOf('day');
    const end = moment().endOf('day');
    res.json({
      success: true,
      count: await Article.count({
        where: {
          createdAt: {
            [Op.gte]: start.toDate(),
            [Op.lte]: end.toDate(),
          },
        },
      } as any),
    });
  }),
);

router.get(
  '/commentcount',
  asyncHandler(async (req, res) => {
    const start = moment().startOf('day');
    const end = moment().endOf('day');
    res.json({
      success: true,
      count: await Comment.count({
        where: {
          createdAt: {
            [Op.gte]: start.toDate(),
            [Op.lte]: end.toDate(),
          },
        },
      } as any),
    });
  }),
);

export default router;
