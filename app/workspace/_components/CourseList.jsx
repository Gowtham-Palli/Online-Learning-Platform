"use client"

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AddNewCourseDialog from './AddNewCourseDialog'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import CourseCard from './CourseCard'

const CourseList = () => {
    const [courseList, setCourseList] = useState([])

    const { user } = useUser();
    useEffect(() => {
        GetCourseList();
    }, [user])

    const GetCourseList = async () => {
        const result = await axios.get('/api/courses');
        console.log(result.data)
        setCourseList(result.data)
    }
    return (
        <div className='flex flex-col gap-3 mt-5'>
            <h2 className='text-2xl font-bold text-white'>Course List</h2>
            {courseList?.length === 0 ? (
                <div className='mt-3 flex flex-col items-center justify-center gap-2 bg-slate-100 border-2 py-10 rounded-lg'>
                    <Image src={'/elearning.png'} alt='edu' width={100} height={50} />
                    <h2>Looks like You haven't created any course yet</h2>
                    <AddNewCourseDialog>
                        <Button>+ Create Course</Button>
                    </AddNewCourseDialog>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
                    {courseList.map((course, index)=>(
                        <CourseCard course={course} key={index}/>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CourseList