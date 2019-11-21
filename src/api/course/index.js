import Router from 'koa-router';
import { apply, cancel, SetStatus, StudentList, CourseList, CreateCourse, CourseDetail, DeleteCourse } from './course.ctrl';

const course = new Router();

course.post('/apply', apply);
course.post('/cancel', cancel);
course.post('/settime', SetStatus)
course.post('/create', CreateCourse);

course.get('/student_list', StudentList);
course.get('/list', CourseList);
course.get('/detail', CourseDetail)

course.delete('/delete', DeleteCourse) 

export default course;