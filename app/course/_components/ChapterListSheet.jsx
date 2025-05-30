// "use client"

// import React, { useContext } from 'react'
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
// import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext'

// const ChapterListSideBar = ({ courseInfo }) => {
//   const courseContent = courseInfo?.courses?.courseContent;
//   const enrollCourse = courseInfo?.enrollCourse;
//   const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
//   const completedChapters = Array.isArray(enrollCourse?.completedChapters) ? enrollCourse.completedChapters : [];

//   return (
//     <div className='w-full lg:w-80 h-auto lg:h-[calc(100vh-6rem)] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 rounded-2xl'>
//       <h2 className='font-bold text-xl text-white mb-2'>Chapters</h2>
//       <Accordion type="single" collapsible>
//         {courseContent?.map((chapter, index) => (
//           <AccordionItem
//             value={chapter?.courseData?.chapterName}
//             key={index}
//             onClick={() => setSelectedChapterIndex(index)}
//             className='bg-slate-500 rounded-2xl mb-2'
//           >
//             <AccordionTrigger className={`text-lg font-medium px-6 ${completedChapters.includes(index) && 'bg-blue-500 text-white'}`}>
//               {index + 1}. {chapter?.courseData?.chapterName}
//             </AccordionTrigger>
//             <AccordionContent asChild>
//               <div>
//                 {chapter?.courseData?.topics.map((topic, i) => (
//                   <h2 key={i} className='bg-slate-400 text-black p-3 mb-2 rounded-lg text-sm'>{topic?.topic}</h2>
//                 ))}
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>
//     </div>
//   )
// }

// export default ChapterListSideBar

"use client"

import React, { useContext } from 'react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext'
import { Button } from "@/components/ui/button"
import { List } from 'lucide-react'

const ChapterListSheet = ({ courseInfo }) => {
  const courseContent = courseInfo?.courses?.courseContent;
  const enrollCourse = courseInfo?.enrollCourse;
  const { selectedChapterIndex, setSelectedChapterIndex } = useContext(SelectedChapterIndexContext);
  const completedChapters = Array.isArray(enrollCourse?.completedChapters) ? enrollCourse.completedChapters : [];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="text-black bg-white hover:cursor-pointer hover:text-black hover:bg-white">
          <List className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-3 w-[300px] sm:w-[400px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white overflow-y-auto max-h-screen scrollbar-hidden">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">Chapters</SheetTitle>
        </SheetHeader>
        <div className='mt-4 space-y-2'>
          <Accordion type="single" collapsible>
            {courseContent?.map((chapter, index) => (
              <AccordionItem
                value={chapter?.courseData?.chapterName}
                key={index}
                onClick={() => setSelectedChapterIndex(index)}
                className='bg-slate-600 rounded-lg mb-2'
              >
                <AccordionTrigger className={`text-left text-lg font-medium px-4 ${completedChapters.includes(index) && 'bg-blue-500 text-white'}`}>
                  {index + 1}. {chapter?.courseData?.chapterName}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-4">
                    {chapter?.courseData?.topics.map((topic, i) => (
                      <div key={i} className='bg-slate-400 text-black p-2 mb-2 rounded-lg text-sm'>{topic?.topic}</div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ChapterListSheet;
