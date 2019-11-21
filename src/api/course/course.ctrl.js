import Joi from 'joi';
import { user_info, course_apply, course_info } from 'models';
import { decodeToken } from 'lib/token.js';

import dotenv from 'dotenv';

dotenv.config();

export const apply = async (ctx) => {
    const ApplyInput = Joi.object().keys({
        courseIdx: Joi.number().required()
    });

    const Result = Joi.validate(ctx.request.body, ApplyInput);

    if (Result.error) {
        console.log(`Apply - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "code": "001"
        }
        return;
    }

    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`Apply - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "009"
        }
        return;
    }
    
    var can_apply = 1;

    const userIn = await user_info.findOne({
        where: {
            email: user.email
        }
    })

    const date = await course_info.findOne({
       where: {
           courseIdx: ctx.request.body.courseIdx
       } 
    });

    var dateArray = date.lectTime.split('');

    const founded = await course_apply.findAll({
        where: {
            email: user.email
        }
    });

    if(date.target.indexOf(userIn.grade) == -1){
        can_apply = 3;
        console.log(`Apply - 신청 가능한 학년이 아닙니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "003"
        }
        return;
    }

    if(date.capacity <= date.studentSize){
        can_apply = 5;
        console.log(`Apply - 정원이 가득 찼습니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "005"
        }
        return;
    }

    if(date.status == 0){ //변경
        can_apply = 4;
        console.log(`Apply - 신청 가능한 강좌가 아닙니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "004"
        }
        return;
    }

    if (founded == null) {
        can_apply = 1;
    }else{
        var i = 0;
        while(founded[i]){
            var istrue = await course_info.findOne({
                where : {
                    courseIdx : founded[i].courseIdx
                }
            });
            if(istrue.courseIdx ==  ctx.request.body.courseIdx){
                can_apply = 2;
                console.log(`Apply - 이미 신청된 강좌입니다.`);
                ctx.status = 400;
                ctx.body = {
                    "error": "002"
                }
                return;
            }
            var test_date = istrue.lectTime.split('');
            var j = 0;
            while(dateArray[j]){
                if(test_date.indexOf(dateArray[i]) != -1){
                    can_apply = 1;
                    console.log(`Apply - 요일이 겹칩니다.`);
                    ctx.status = 400;
                    ctx.body = {
                        "error": "001"
                    }
                    return;
                }
                j++;
            }
            i++;
        }
    }
    if(can_apply == 1){
        await course_apply.create({
            "email": user.email,
            "courseIdx": ctx.request.body.courseIdx,
            "time": Date.now()
        });
    }else if(can_apply == 0){
        console.log(`Apply - 요일이 겹칩니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }else if(can_apply == 2){
        console.log(`Apply - 이미 신청된 강좌입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "002"
        }
        return;
    }else if(can_apply == 3){
        console.log(`Apply - 신청 가능한 학년이 아닙니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "003"
        }
        return;
    }else if(can_apply == 4){
        console.log(`Apply - 신청 가능한 강좌가 아닙니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "004"
        }
        return;
    }else if(can_apply == 5){
        console.log(`Apply - 정원이 가득 찼습니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "005"
        }
        return;
    }
    ctx.status = 200;
}

export const cancel = async (ctx) => {
    const ApplyInput = Joi.object().keys({
        courseIdx: Joi.number().required()
    });

    const Result = Joi.validate(ctx.request.body, ApplyInput);

    if (Result.error) {
        console.log(`Apply - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "code": "001"
        }
        return;
    }

    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`Apply - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "009"
        }
        return;
    }

    const founded = await course_apply.findOne({
        where: {
            email: user.email,
            courseIdx: ctx.request.body.courseIdx
        }
    });
    if(founded){
        await founded.destroy();
    }else {
        console.log(`Apply - 신청되어 있지 않은 강좌입니다.`);
        ctx.status = 400;
        ctx.body = {
            "error": "001"
        }
        return;
    }
    ctx.status = 200;
}