import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import CourseList from './_components/CourseList'
import EnrollCourseList from './_components/EnrollCourseList'
import { EnrolledCoursesProvider } from '@/context/EnrolledCoursesContext'

const Workspace = () => (
  <EnrolledCoursesProvider>
    <WelcomeBanner />
    <CourseList />
    <EnrollCourseList />
  </EnrolledCoursesProvider>
);

export default Workspace;
