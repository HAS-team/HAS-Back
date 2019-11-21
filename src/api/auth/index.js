import Router from 'koa-router';
import { Login, Register } from './auth.ctrl';

const auth = new Router();

auth.post('/login', Login);
auth.post('/register', Register);

export default auth;