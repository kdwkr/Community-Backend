import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import CONF from '../config';

export default (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.auth;
  if (!token) {
    res.json({ status: 401, msg: 'Unauthorized' });
    return;
  }

  JWT.verify(token, CONF.jwt.key, async (err: any, decoded: any) => {
    if (!err) {
      req.auth = decoded;
      next();
    } else if (err.name === 'TokenExpiredError') {
      res.json({ success: false, code: 401 });
    } else if (err.name === 'JsonWebTokenError') {
      res.json({ success: false, code: 401 });
    } else {
      res.json({
        success: false,
        code: 401,
        msg: `토큰 인증 절차에 오류가 발생하였습니다 : ${err.message}`,
      });
    }
  });
};