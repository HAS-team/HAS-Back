import Router from 'koa-router';
import { apply, cancel, SetStatus, StudentList, CourseList, CreateCourse } from './course.ctrl';

const course = new Router();

course.post('/apply', apply);
course.post('/cancel', cancel);
course.post('/settime', SetStatus)
course.post('/create', CreateCourse);
course.get('/student_list', StudentList);
course.get('/list', CourseList);

export default course;