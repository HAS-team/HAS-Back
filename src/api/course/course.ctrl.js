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

export const CourseList = async (ctx) => {
    //로그인 한 유저인가?
    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`CourseList - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "code": "009"
        }
        return;
    }

    //유저가 신청한 강좌 불러오기
    const applied = await course_apply.findOne({
        where: {
            email: user.email
        }
    })

    let applied_ids = [];

    for (var i in applied) {
        applied_ids.push(applied[i].courseIdx)
    }


    //전체 강좌 불러오기
    const list = await course_info.findAll()

    let courseArray = [];

    for (var i in list) {
        const record = {
            sort: list[i].sort,
            name: list[i].name,
            target: list[i].target,
            capacity: list[i].capacity,
            studentSize: list[i].studentSize,
            lectTime: list[i].lectTime,
            operTime: list[i].operTime,
            totalTime: list[i].totalTime,
            content: list[i].content,
            openTime: list[i].openTime,
            closeTime: list[i].closeTime,
            status: list[i].status,
        }
        if (list[i].courseIdx in applied_ids) {
            courseArray.unshift(record)
        }
        else {
            courseArray.push(record);
        }
    }

    console.log(courseArray)

    ctx.status = 200
    ctx.body = {
        "courses": courseArray
    }
}

export const StudentList = async (ctx) => {
    //로그인 한 유저인가?
    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`StudentList - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "code": "009"
        }
        return;
    }

    //원하는 강좌의 번호 확인
    const course_id = ctx.request.query.course_id

    const student_list = await course_apply.findAll({
        where: {
            courseIdx: course_id
        }
    })

    //학생 정보 불러와서 배열에 저장
    let studentArray = [];

    for (var i in student_list) {
        const student = await user_info.findOne({
            where: {
                email: student_list[i].email
            }
        });

        const record = {
            grade: student.grade,
            class: student.class,
            no: student.no,
            name: student.name
        }

        studentArray.push(record)
    }

    console.log(`StudentList - 수강 신청 목록을 반환했습니다. / 강좌 : ${ctx.request.query.course_id}`)

    ctx.status = 200;
    ctx.body = {
        "students": studentArray
    }
}

export const SetStatus = async (ctx) => {
    //Joi 형식 검사
    const StatusInput = Joi.object().keys({
        sort: Joi.string().required(),
        openTime: Joi.date().required(),
        closeTime: Joi.date().required()
    });

    const Result = Joi.validate(ctx.request.body, StatusInput);

    if (Result.error) {
        console.log(`SetStatus - Joi 형식 에러`);
        ctx.status = 400;
        ctx.body = {
            "code": "001"
        }
        return;
    }

    //로그인 한 유저인가?
    const user = await decodeToken(ctx.header.token);

    if (user == null) {
        console.log(`SetStatus - 올바르지 않은 토큰입니다.`);
        ctx.status = 400;
        ctx.body = {
            "code": "009"
        }
        return;
    }

    //어드민인지 확인
    const account = await user_info.findOne({
        where: {
            email: user.email
        }
    })

    if (account.grade != 4) {
        console.log(`SetStatus - 권한이 없습니다.`);
        ctx.status = 403;
        ctx.body = {
            "code": "009"
        }
        return;
    }

    //수정하려는 강좌 조회
    const list = await course_info.findAll({
        where: {
            sort: ctx.request.body.sort
        }
    })

    if (list == null) {
        console.log(`SetStatus - 수정할 강좌가 없습니다.`);
        ctx.status = 400;
        ctx.body = {
            "code": "009"
        }
        return;
    }

    //시간 설정
    for (var i in list) {
        const course = await course_info.findOne({
            where: {
                courseIdx: list[i].courseIdx
            }
        });

        await course.update({
            openTime: ctx.request.body.openTime,
            closeTime: ctx.request.body.closeTime
        })
    }

    console.log(`SetStatus - 시간 설정이 완료되었습니다.`)

    ctx.status = 200;

}