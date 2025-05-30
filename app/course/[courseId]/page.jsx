// "use client"

// import AppHeader from '@/app/workspace/_components/AppHeader'
// import React, { useEffect, useState } from 'react'
// import ChapterListSideBar from '../_components/ChapterListSheet'
// import ChapterContent from '../_components/ChapterContent'
// import axios from 'axios'
// import { useParams } from 'next/navigation'
// import { SidebarProvider } from '@/components/ui/sidebar'
// import { AppsideBar } from '@/app/workspace/_components/AppsideBar'

// const Course = () => {
//     const { courseId } = useParams();
//     const [courseInfo, setCourseInfo] = useState([])
//     useEffect(() => {
//         GetEnrolledCourseById();
//     }, [])


//     const GetEnrolledCourseById = async () => {
//         try {
//             console.log('courseId', courseId)
//             const result = await axios.get('/api/enroll-course?courseId=' + courseId);
//             console.log('res: ', result.data)
//             setCourseInfo(result.data);
//         }
//         catch (e) {
//             console.log(e);
//         }
//     }
//     return (
//         <SidebarProvider>
//             <AppsideBar />
//             <div>
//                 <AppHeader />
//                 <div className='flex gap-4'>
//                     <ChapterListSideBar courseInfo={courseInfo} />
//                     <ChapterContent courseInfo={courseInfo} refreshData={() => GetEnrolledCourseById()} />
//                 </div>
//             </div>
//         </SidebarProvider>
//     )
// }

// export default Course


// "use client"

// import AppHeader from '@/app/workspace/_components/AppHeader'
// import React, { useEffect, useState } from 'react'
// import ChapterListSideBar from '../_components/ChapterListSideBar'
// import ChapterContent from '../_components/ChapterContent'
// import axios from 'axios'
// import { useParams } from 'next/navigation'

// const Course = () => {
//   const { courseId } = useParams();
//   const [courseInfo, setCourseInfo] = useState([])

//   useEffect(() => {
//     GetEnrolledCourseById();
//   }, [])

//   const GetEnrolledCourseById = async () => {
//     try {
//       const result = await axios.get('/api/enroll-course?courseId=' + courseId);
//       setCourseInfo(result.data);
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   return (
//     <>
//       <AppHeader hideSidebar={true} />
//       <div className='flex flex-col lg:flex-row gap-4 p-4'>
//         <ChapterListSideBar courseInfo={courseInfo} />
//         <ChapterContent courseInfo={courseInfo} refreshData={GetEnrolledCourseById} />
//       </div>
//     </>
//   )
// }

// export default Course




// "use client"

// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useParams } from 'next/navigation'

// import AppHeader from '@/app/workspace/_components/AppHeader'
// import ChapterListSideBar from '../_components/ChapterListSideBar'
// import ChapterContent from '../_components/ChapterContent'
// import { SidebarDrawer } from '../_components/SidebarDrawer'
// import Header from '../_components/Header'

// const Course = () => {
//   const { courseId } = useParams()
//   const [courseInfo, setCourseInfo] = useState([])

//   useEffect(() => {
//     GetEnrolledCourseById()
//   }, [])

//   const GetEnrolledCourseById = async () => {
//     try {
//       const result = await axios.get('/api/enroll-course?courseId=' + courseId)
//       setCourseInfo(result.data)
//     } catch (e) {
//       console.log(e)
//     }
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//         <Header/>

//       {/* Mobile drawer trigger */}
//       <div className="p-4 lg:hidden">
//         <SidebarDrawer courseInfo={courseInfo} />
//       </div>

//       {/* Main content area */}
//       <div className="flex-1 flex flex-col lg:flex-row">
//         {/* Sidebar visible on desktop */}
//         <div className="hidden lg:block w-full lg:w-80 border-r">
//           <ChapterListSideBar courseInfo={courseInfo} />
//         </div>

//         {/* Chapter content */}
//         <div className="flex-1 p-4">
//           <ChapterContent courseInfo={courseInfo} refreshData={GetEnrolledCourseById} />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Course



"use client"

import AppHeader from '@/app/workspace/_components/AppHeader'
import React, { useEffect, useState } from 'react'
import ChapterContent from '../_components/ChapterContent'
import axios from 'axios'
import { useParams } from 'next/navigation'

const Course = () => {
  const { courseId } = useParams()
  const [courseInfo, setCourseInfo] = useState(null)

  useEffect(() => {
    GetEnrolledCourseById()
  }, [])

  const GetEnrolledCourseById = async () => {
    try {
      const result = await axios.get('/api/enroll-course?courseId=' + courseId)
      setCourseInfo(result.data)
    } catch (e) {
      console.log(e)
    }
  }

  if (!courseInfo) return null

  return (
    <div className="flex flex-col min-h-screen">
      {/* AppHeader with Sheet sidebar trigger */}
      <AppHeader courseInfo={courseInfo} />

      {/* Main content area */}
      <div className="flex-1 p-4">
        <ChapterContent courseInfo={courseInfo} refreshData={GetEnrolledCourseById} />
      </div>
    </div>
  )
}

export default Course

