// import React, { useContext, useState } from 'react'
// import { Button } from '@/components/ui/button';
// import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext'
// import axios from 'axios';
// import { CheckCircle, Video, X } from 'lucide-react';
// import { useParams } from 'next/navigation';
// import YouTube from 'react-youtube';
// import { toast } from 'sonner';

// const ChapterContent = ({ courseInfo, refreshData }) => {
//     const { courseId } = useParams();
//     const { course, enrollCourse } = courseInfo;
//     const courseContent = courseInfo?.courses?.courseContent;
//     const { selectedChapterIndex } = useContext(SelectedChapterIndexContext);
//     const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo;
//     const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics;
//     const toIncludeVideo = courseInfo?.courses?.includeVideo;
//     console.log(toIncludeVideo);

//     const completedChapters = Array.isArray(enrollCourse?.completedChapters) ? enrollCourse.completedChapters : [];
//     const [loading, setLoading] = useState(false);

//     const markChapterCompleted = async () => {
//         if (!completedChapters.includes(selectedChapterIndex)) {
//             setLoading(true);
//             try {
//                 const updated = [...completedChapters, selectedChapterIndex];
//                 await axios.put('/api/enroll-course', {
//                     courseId: courseId,
//                     completedChapters: updated
//                 });
//                 refreshData();
//                 toast('You have completed this Chapter Successfully');
//             } catch (e) {
//                 toast('Failed to mark as completed.');
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     const markChapterIncomplete = async () => {
//         if (completedChapters.includes(selectedChapterIndex)) {
//             setLoading(true);
//             try {
//                 const updated = completedChapters.filter(idx => idx !== selectedChapterIndex);
//                 await axios.put('/api/enroll-course', {
//                     courseId: courseId,
//                     completedChapters: updated
//                 });
//                 refreshData();
//                 toast('Chapter marked as incomplete.');
//             } catch (e) {
//                 toast('Failed to mark as incomplete.');
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     return (
//         <div className="p-5 space-y-6">
//             {/* Chapter header */}
//             <div className="flex items-center justify-between bg-gradient-to-br from-slate-900 via-slate-700 to-gray-300 p-4 rounded-2xl text-white">
//                 <h2 className="text-2xl font-bold">
//                     {selectedChapterIndex + 1}. {courseContent?.[selectedChapterIndex]?.courseData?.chapterName}
//                 </h2>
//                 {!completedChapters.includes(selectedChapterIndex) ? (
//                     <Button onClick={markChapterCompleted} disabled={loading} className="bg-slate-800 text-green-500">
//                         <CheckCircle className="mr-1 size-5" />
//                         {loading ? 'Loading...' : 'Mark as Completed'}
//                     </Button>
//                 ) : (
//                     <Button onClick={markChapterIncomplete} disabled={loading} className="bg-slate-800 text-red-500">
//                         <X className="mr-1 size-5" />
//                         {loading ? 'Loading...' : 'Mark incomplete'}
//                     </Button>
//                 )}
//             </div>

//             {/* Video Section */}
//             {toIncludeVideo && (
//                 <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 rounded-2xl">
//                     <h2 className="flex gap-2 text-xl items-center font-semibold text-yellow-200 mb-4">
//                         Related Videos <Video className="size-5" />
//                     </h2>
//                     <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
//                         {videoData?.map((video, index) => (
//                             <div key={index} className="w-full aspect-video rounded-lg overflow-hidden">
//                                 <YouTube
//                                     videoId={video?.videoId}
//                                     opts={{
//                                         width: '100%',
//                                         height: '100%',
//                                         playerVars: {
//                                             rel: 0,
//                                         },
//                                     }}
//                                     className="w-full h-full"
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Topics Section */}
//             {topics?.map((topic, index) => (
//                 <div key={index} className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 rounded-2xl">
//                     <h2 className="font-bold text-red-200 text-xl">{index + 1}. {topic?.topic}</h2>
//                     <div
//                         dangerouslySetInnerHTML={{ __html: topic?.content }}
//                         className="text-blue-200"
//                         style={{ lineHeight: '2.5' }}
//                     />
//                 </div>
//             ))}
//         </div>

//     );
// };

// export default ChapterContent;


'use client'

import React, { useContext, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SelectedChapterIndexContext } from '@/context/SelectedChapterIndexContext'
import axios from 'axios'
import { CheckCircle, Video, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import YouTube from 'react-youtube'
import { toast } from 'sonner'

const ChapterContent = ({ courseInfo, refreshData }) => {
  const { courseId } = useParams()
  const { enrollCourse } = courseInfo
  const courseContent = courseInfo?.courses?.courseContent
  const { selectedChapterIndex } = useContext(SelectedChapterIndexContext)
  const videoData = courseContent?.[selectedChapterIndex]?.youtubeVideo
  const topics = courseContent?.[selectedChapterIndex]?.courseData?.topics
  const toIncludeVideo = courseInfo?.courses?.includeVideo

  const completedChapters = Array.isArray(enrollCourse?.completedChapters)
    ? enrollCourse.completedChapters
    : []

  const [loading, setLoading] = useState(false)

  const markChapterCompleted = async () => {
    if (!completedChapters.includes(selectedChapterIndex)) {
      setLoading(true)
      try {
        const updated = [...completedChapters, selectedChapterIndex]
        await axios.put('/api/enroll-course', {
          courseId,
          completedChapters: updated
        })
        refreshData()
        toast.success('You have completed this Chapter Successfully')
      } catch {
        toast.error('Failed to mark as completed.')
      } finally {
        setLoading(false)
      }
    }
  }

  const markChapterIncomplete = async () => {
    if (completedChapters.includes(selectedChapterIndex)) {
      setLoading(true)
      try {
        const updated = completedChapters.filter(
          (idx) => idx !== selectedChapterIndex
        )
        await axios.put('/api/enroll-course', {
          courseId,
          completedChapters: updated
        })
        refreshData()
        toast('Chapter marked as incomplete.')
      } catch {
        toast.error('Failed to mark as incomplete.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="sm:items-center p-4 md:p-6 space-y-6 w-full">
      {/* Chapter Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gradient-to-br from-slate-900 via-slate-700 to-gray-300 p-4 md:p-6 rounded-2xl text-white w-full">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-0">
          {selectedChapterIndex + 1}.{' '}
          {courseContent?.[selectedChapterIndex]?.courseData?.chapterName}
        </h2>

        {completedChapters.includes(selectedChapterIndex) ? (
          <Button
            onClick={markChapterIncomplete}
            disabled={loading}
            className="bg-slate-800 text-red-500"
          >
            <X className="mr-2 size-5" />
            {loading ? 'Loading...' : 'Mark Incomplete'}
          </Button>
        ) : (
          <Button
            onClick={markChapterCompleted}
            disabled={loading}
            className="bg-slate-800 text-green-500"
          >
            <CheckCircle className="mr-2 size-5" />
            {loading ? 'Loading...' : 'Mark as Completed'}
          </Button>
        )}
      </div>

      {/* Video Section */}
      {toIncludeVideo && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4 md:p-6 rounded-2xl">
          <h2 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-yellow-200 mb-4">
            Related Videos <Video className="size-5" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {videoData?.map((video, index) => (
              <div
                key={index}
                className="w-full aspect-video overflow-hidden rounded-xl shadow-lg"
              >
                <YouTube
                  videoId={video?.videoId}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: { rel: 0 }
                  }}
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics Section */}
      {topics?.map((topic, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-4 md:p-6 rounded-2xl"
        >
          <h3 className="text-xl font-bold text-red-300 mb-2">
            {index + 1}. {topic?.topic}
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: topic?.content }}
            className="prose prose-invert max-w-none text-blue-200"
            style={{ lineHeight: '2.4' }}
          />
        </div>
      ))}
    </div>
  )
}

export default ChapterContent
