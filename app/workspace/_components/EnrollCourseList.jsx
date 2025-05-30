"use client"
import React, { useContext } from 'react'
import EnrolledCourseCard from './EnrolledCourseCard'
import { EnrolledCoursesContext } from '../../../context/EnrolledCoursesContext'

const EnrollCourseList = () => {
  const { enrolledCourses, loading } = useContext(EnrolledCoursesContext);

  if (loading) return <div className="text-white">Loading enrolled courses...</div>;

  if (!enrolledCourses || enrolledCourses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 mt-10 text-white opacity-60">
        <h2 className="text-xl">You haven't enrolled in any courses yet.</h2>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3 mt-5'>
      <h2 className='font-bold text-2xl text-white'>Continue learning Courses</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
        {enrolledCourses.map((course, index) => (
          <EnrolledCourseCard
            course={course?.courses}
            enrolledCourse={course?.enrollCourse}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

export default EnrollCourseList
