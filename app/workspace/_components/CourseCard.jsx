// import { Button } from '@/components/ui/button'
// import axios from 'axios'
// import { Book, LoaderCircle, PlayCircle, Settings } from 'lucide-react'
// import Image from 'next/image'
// import Link from 'next/link'
// import React, { useState } from 'react'
// import { toast } from 'sonner'

// const CourseCard = ({ course }) => {
//     const courseJson = course?.courseJson?.course;
//     const [loading, setloading] = useState(false)
//     const onEnrollCourse = async () => {
//         try {
//             setloading(true);
//             const result = await axios.post('/api/enroll-course', {
//                 courseId: course?.cid
//             });
//             console.log(result.data);
//             if (result.data.resp) {
//                 toast.warning('Already Enrolled');
//                 setloading(false);

//                 return;
//             }
//             toast.success('Enrolled');
//             setloading(false);
//         }
//         catch (e) {
//             toast.error('Server side error')
//             setloading(false);
//         }
//     }
//     return (
//         <div className="shadow-md rounded-b-xl flex flex-col h-full">
//             <Image
//                 src={course?.bannerImageUrl}
//                 width={300}
//                 height={300}
//                 alt="course-img"
//                 className="w-full aspect-video rounded-t-xl object-cover"
//             />
//             <div className="flex flex-col h-full p-3 gap-1 bg-gray-700 rounded-b-xl">
//                 {/* Title */}
//                 <h2 className="font-bold text-lg text-white">{courseJson?.name}</h2>

//                 {/* Description Centered */}
//                 <div className="flex-1 flex items-center">
//                     <p className="text-gray-400 line-clamp-3 text-sm w-full ">
//                         {courseJson?.description}
//                     </p>
//                 </div>

//                 {/* Bottom Row */}
//                 <div className="flex justify-between mt-1">
//                     <h2 className="flex items-center gap-1 text-white">
//                         <Book className="text-green-500 h-5 w-5" />
//                         Chapters: {course?.noOfChapters}
//                     </h2>
//                     {course?.courseContent?.length ? (
//                         <Button size={"sm"} onClick={onEnrollCourse} disabled={loading}>
//                             {loading ? (
//                                 <LoaderCircle className="animate-spin" />
//                             ) : (
//                                 <PlayCircle />
//                             )}
//                             Enroll Course
//                         </Button>
//                     ) : (
//                         <Link href={"/workspace/edit-course/" + course?.cid}>
//                             <Button size={"sm"}>
//                                 <Settings />
//                                 Generate Course
//                             </Button>
//                         </Link>
//                     )}
//                 </div>
//             </div>
//         </div>

//     )
// }

// export default CourseCard

import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Book, LoaderCircle, PlayCircle, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useContext } from 'react'
import { toast } from 'sonner'
import { EnrolledCoursesContext } from '../../../context/EnrolledCoursesContext'

const CourseCard = ({ course }) => {
  const courseJson = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);
  const { refreshEnrolledCourses } = useContext(EnrolledCoursesContext);

  const onEnrollCourse = async () => {
    try {
      setLoading(true);
      const result = await axios.post('/api/enroll-course', {
        courseId: course?.cid
      });
      if (result.data.resp) {
        toast.warning('Already Enrolled');
        setLoading(false);
        return;
      }
      toast.success('Enrolled');
      setLoading(false);
      refreshEnrolledCourses(); // <-- Triggers context update
    }
    catch (e) {
      toast.error('Server side error')
      setLoading(false);
    }
  }

  return (
    <div className="shadow-md rounded-b-xl flex flex-col h-full">
      <Image
        src={course?.bannerImageUrl}
        width={300}
        height={300}
        alt="course-img"
        className="w-full aspect-video rounded-t-xl object-cover"
      />
      <div className="flex flex-col h-full p-3 gap-1 bg-gray-700 rounded-b-xl">
        <h2 className="font-bold text-lg text-white">{courseJson?.name}</h2>
        <div className="flex-1 flex items-center">
          <p className="text-gray-400 line-clamp-3 text-sm w-full ">
            {courseJson?.description}
          </p>
        </div>
        <div className="flex justify-between mt-1">
          <h2 className="flex items-center gap-1 text-white">
            <Book className="text-green-500 h-5 w-5" />
            Chapters: {course?.noOfChapters}
          </h2>
          {course?.courseContent?.length ? (
            <Button size={"sm"} onClick={onEnrollCourse} disabled={loading}>
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <PlayCircle />
              )}
              Enroll Course
            </Button>
          ) : (
            <Link href={"/workspace/edit-course/" + course?.cid}>
              <Button size={"sm"}>
                <Settings />
                Generate Course
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard

