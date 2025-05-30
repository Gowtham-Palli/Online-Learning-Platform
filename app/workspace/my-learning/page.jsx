import React from 'react'
import EnrollCourseList from '../_components/EnrollCourseList'
import { EnrolledCoursesProvider } from '@/context/EnrolledCoursesContext'


const MyLearning = () => {
  return (
    <EnrolledCoursesProvider>
      <div>
        <h2 className='font-bold text-3xl mb-3 text-white'>My Learning</h2>
        <EnrollCourseList />
      </div>
    </EnrolledCoursesProvider>
  )
}

export default MyLearning
