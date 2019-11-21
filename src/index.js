import dotenv from 'dotenv';
dotenv.config();

import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';

const app = new Koa();
const router = new Router();

import { sequelize } from './models';
sequelize.sync();
import api from './api'

import bodyParser from 'koa-bodyparser';

app.use(cors());

const port = process.env.PORT || 4000;

app.use(bodyParser());
router.use('/api', api.routes());
app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`Charger Backend Server Started.. with port ${port}`);
});
