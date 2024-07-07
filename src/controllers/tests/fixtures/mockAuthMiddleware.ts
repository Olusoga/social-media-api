import { Request, Response, NextFunction } from 'express';

const mockAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.user = { id: 'testUserId' };
  next();
};

export default mockAuthMiddleware;
