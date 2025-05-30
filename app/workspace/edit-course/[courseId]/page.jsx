"use client"

import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseInfo from '../_components/CourseInfo';
import ChapterTopicList from '../_components/ChapterTopicList';
import JSON5 from 'json5';

const EditCourse = ({viewCourse=false}) => {
    const { courseId } = useParams();
    const [loading, setloading] = useState();
    const [course, setCourse] = useState()
    useEffect(() => {
        GetCourseInfo();
    }, [])


    const GetCourseInfo = async () => {
        setloading(true);
        const result = await axios.get('/api/courses?courseId=' + courseId);
        console.log(result.data);
        setloading(false);
        setCourse(result.data);
    }

    return (
        <div>
            <CourseInfo course={course} viewCourse={viewCourse}/>
            <ChapterTopicList course={course}/>
        </div>
    )
}

export default EditCourse
