import { Router } from 'express';
import { fn, col } from 'sequelize';
import { asyncHandler, needAuth } from '../middlewares';
import { Comment, Article } from '../db';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const articleId = Number(req.query.articleId as string);
    const parentCommentId = Number(req.query.parentCommentId as string);
    const page = Math.max(1, Number((req.query.page as string) || 1));
    if (!articleId) {
      res.json({ success: false, code: 404 });
      return;
    }
    const article = await Article.findByPk(articleId);
    if (!article) {
      res.json({ success: false, code: 404 });
      return;
    }
    res.json({
      success: true,
      comments: await article.getComments({
        subQuery: false,
        include: [
          {
            model: Comment as any,
            attributes: [],
            as: 'childComments',
          },
          {
            association: Comment.associations.writer,
            attributes: ['id', 'nickname'],
          },
        ],
        attributes: [
          'id',
          'content',
          'createdAt',
          'updatedAt',
          [
            fn('COUNT', col('childComments.parentCommentId')),
            'childCommentCount',
          ],
        ],
        group: 'id',
        limit: 15,
        offset: 15 * (page - 1),
        where: {
          parentCommentId: parentCommentId || null,
        },
      }),
    });
  }),
);

router.post(
  '/',
  needAuth,
  asyncHandler(async (req, res) => {
    const articleId = Number(req.query.articleId as string);
    const parentCommentId = Number(req.query.parentCommentId as string);
    const content = req.body.content as string;
    if (!articleId) {
      res.json({ success: false, code: 404 });
      return;
    }
    if (!content) {
      res.json({ success: false, code: 400 });
      return;
    }
    const article = await Article.findByPk(articleId);
    if (!article) {
      res.json({ success: false, code: 404 });
      return;
    }
    const comment = await article.createComment({
      content,
      articleId,
      parentCommentId: parentCommentId || null,
      userId: req.auth.id,
    });
    res.json({ success: true, id: comment.id });
  }),
);

router.get(
  '/my',
  needAuth,
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number((req.query.page as string) || 1));
    res.json({
      success: true,
      comments: await Comment.findAll({
        subQuery: false,
        include: [
          {
            model: Comment as any,
            attributes: [],
            as: 'childComments',
          },
          {
            association: Comment.associations.writer,
            attributes: ['id', 'nickname'],
          },
        ],
        attributes: [
          'id',
          'content',
          'createdAt',
          'updatedAt',
          [
            fn('COUNT', col('childComments.parentCommentId')),
            'childCommentCount',
          ],
        ],
        group: 'id',
        limit: 15,
        offset: 15 * (page - 1),
        where: {
          userId: req.auth.id,
        },
      }),
    });
  }),
);

router.put(
  '/:commentId',
  needAuth,
  asyncHandler(async (req, res) => {
    const commentId = Number(req.params.commentId);
    const content = req.body.content as string;
    if (!commentId) {
      res.json({ success: false, code: 404 });
      return;
    }
    if (!content) {
      res.json({ success: false, code: 400 });
      return;
    }
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      res.json({ success: false, code: 404 });
      return;
    }
    if (comment.userId !== req.auth.id) {
      res.json({ success: false, code: 401 });
      return;
    }
    await comment.update({ content });
    res.json({ success: true });
  }),
);

router.delete(
  '/:commentId',
  needAuth,
  asyncHandler(async (req, res) => {
    const commentId = Number(req.params.commentId);
    if (!commentId) {
      res.json({ success: false, code: 404 });
      return;
    }
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      res.json({ success: false, code: 404 });
      return;
    }
    if (comment.userId !== req.auth.id) {
      res.json({ success: false, code: 401 });
      return;
    }
    await comment.destroy();
    res.json({ success: true });
  }),
);

export default router;
