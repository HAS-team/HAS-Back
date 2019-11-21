import Router from 'koa-router';

import auth from './auth';

import course from './course';

const api = new Router;

api.use('/auth', auth.routes());
api.use('/course', course.routes());

export default api;