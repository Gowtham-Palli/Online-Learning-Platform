import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Book, Clock, Loader2Icon, PlayCircle, Settings, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

const CourseInfo = ({ course, viewCourse }) => {
    const courseLayout = course?.courseJson?.course;
    const bannerImageUrl = course?.bannerImageUrl;
    const [loading, setloading] = useState(false);
    const router = useRouter();
    const GenerateCourseContent = async () => {
        setloading(true);
        try {
            const result = await axios.post('/api/generate-course-content', {
                courseJson: courseLayout,
                courseTitle: course?.name,
                courseId: course?.cid
            })
            console.log(result.data);           
            setloading(false);
            toast.success('Course Generated Succefully');
            router.replace('/workspace');
        }
        catch (e) {
            console.log(e);
            setloading(false);
            toast.error('Server Error');
        }
    }

    function parseDuration(durationStr) {
        if (!durationStr) return 0;
        const num = parseFloat(durationStr);
        return isNaN(num) ? 0 : num;
    }

    const totalDuration = courseLayout?.chapters
        ?.reduce((sum, chapter) => sum + parseDuration(chapter.duration), 0) || 0;

    const hours = Math.floor(totalDuration);
    const minutes = Math.round((totalDuration - hours) * 60);
    const formattedDuration =
        minutes > 0 ? `${hours} Hours ${minutes} Minutes` : `${hours} Hours`;


    return (
        <div className='flex flex-col-reverse md:flex-row gap-3 p-5 bg-gradient-to-br from-slate-900 via-slate-700 to-gray-300 rounded-2xl items-center'>
            <div className='flex flex-col gap-3'>

                <h2 className='font-bold text-2xl text-white'>{courseLayout?.name}</h2>
                <p className='line-clamp-2 text-gray-400'>{courseLayout?.description}</p>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 '>
                    <div className='flex items-center rounded-lg p-3 gap-5 bg-slate-800 bg-opacity-80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md'>
                        <Clock className='text-blue-500' />
                        <section>
                            <h2 className='font-bold text-gray-200'>Duration</h2>
                            <h2 className='text-red-100'>{formattedDuration}</h2>
                        </section>
                    </div>
                    <div className='flex items-center  p-3 rounded-lg gap-5 bg-slate-800 bg-opacity-80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md'>
                        <Book className='text-green-500' />
                        <section>
                            <h2 className='font-bold text-gray-200'>Chapters</h2>
                            <h2 className='text-red-100'>{course?.noOfChapters}</h2>
                        </section>
                    </div>
                    <div className='flex items-center  rounded-lg p-3 gap-5 bg-slate-800 bg-opacity-80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md'>
                        <TrendingUp className='text-red-500' />
                        <section>
                            <h2 className='font-bold text-gray-200'>Difficulty Level</h2>
                            <h2 className='text-red-100'>{course?.level}</h2>
                        </section>
                    </div>
                </div>
                {!viewCourse ?
                    <Button className={'max-w-sm bg-slate-900'} onClick={GenerateCourseContent}>{loading ? <Loader2Icon className='animate-spin' /> :
                        <Settings />}
                        Generate Content</Button> :
                    <Link href={'/course/' + course?.cid}>
                        <Button><PlayCircle />Continue Learning</Button>
                    </Link>}
            </div>
            {bannerImageUrl ? (
                <Image
                    src={bannerImageUrl}
                    alt='banner image'
                    width={100}
                    height={100}
                    className='w-full h-[200px] object-cover rounded-lg'
                />
            ) : null}

        </div>
    )
}

export default CourseInfo


