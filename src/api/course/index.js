import Router from 'koa-router';
import { apply, cancel } from './course.ctrl';

const course = new Router();

course.post('/apply', apply);
course.post('/cancel', cancel);

export default course;