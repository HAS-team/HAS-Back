import Joi from 'joi';
import crypto from 'crypto';
import { user_info } from 'models';
import { generateToken } from 'lib/token.js';

import dotenv from 'dotenv';
dotenv.config();

export const Login = async (ctx) => {
    const LoginInput = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });

    const Result = Joi.validate(ctx.request.body, LoginInput);

    if (Result.error) {
        console.log(`Login - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "code": "001"
        }
        return;
    }

    const founded = await user_info.findOne({
        where: {
            email: ctx.request.body.email
        }
    });

    if (founded == null) {
        console.log(`Login - 존재하지 않는 계정입니다. / 입력된 이메일 : ${ctx.request.body.email}`);
        ctx.status = 400;
        ctx.body = {
            "error": "005"
        }
        return;
    }

    const input = crypto.createHmac('sha256', process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    if (founded.password != input) {
        console.log(`Login - 비밀번호를 틀렸습니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "006"
        }
        return;
    }

    const payload = {
        email: founded.email
    };

    let token = null;
    token = await generateToken(payload);

    const is_admin = founded.class <= 0 ? true : false

    console.log(token);

    ctx.body = {
        token: token,
        is_admin : is_admin
    };

    console.log(`로그인에 성공하였습니다.`);

}

export const Register = async (ctx) => {
    const Registeration = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        name: Joi.string().required(),
        grade: Joi.number().required(),
        class: Joi.number().required(),
        no: Joi.number().required(),
    });
    console.log(ctx.request.body)
    const result = Joi.validate(ctx.request.body, Registeration)

    if (result.error) {
        console.log("Register - Joi 형식 에러")
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }

    const existId = await user_info.findOne({
        where: {
            email: ctx.request.body.email
        }
    });

    if (existId != null) {
        console.log(`Register - 이미 존재하는 이메일입니다. / 입력된 이메일 : ${ctx.request.body.email}`);

        ctx.status = 400;
        ctx.body = {
            "error": "002"
        }
        return;
    }
    console.log(process.env.Password_KEY);
    const password = crypto.createHmac('sha256', process.env.Password_KEY).update(ctx.request.body.password).digest('hex');

    await user_info.create({
        "email": ctx.request.body.email,
        "password": password,
        "name": ctx.request.body.name,
        "grade": ctx.request.body.grade,
        "class": ctx.request.body.class,
        "no": ctx.request.body.no,
    });

    console.log(`Register - 새로운 회원이 저장되었습니다. / 이메일 : ${ctx.request.body.email}`);

    ctx.status = 200;

}