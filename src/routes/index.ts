import {Router, Request, Response } from 'express';
import { version, uptime, platform, arch } from 'process'
import { sendResponse } from '../utils/index'
import authRoutes from './auth.routes'

const routes = Router()


routes.get('/', (req: Request, res: Response) => {
  const serverUpTime = Number(uptime() / 60);
  return sendResponse(res, 200, {
    time: new Date().toISOString(),
    uptime:
      serverUpTime > 60
        ? (serverUpTime / 60).toFixed(2) + ' hours'
        : serverUpTime.toFixed(2) + ' Mins',
    platform: platform,
    arch: arch,
    node: version,
  });
});


routes.use('/auth', authRoutes)

export default routes
