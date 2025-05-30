import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Book, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const EnrolledCourseCard = ({ course, enrolledCourse }) => {
    const courseJson = course?.courseJson?.course;
    const calculateProgress = () => {
        const total = course?.courseContent?.length || 1; 
        const completed = enrolledCourse?.completedChapters?.length || 0;
        
        return Math.floor((completed / total) * 100);
    };

    return (

        <div className="shadow-md rounded-b-xl flex flex-col h-full ">
            <Image
                src={course?.bannerImageUrl}
                width={300}
                height={300}
                alt="course-img"
                className="w-full aspect-video rounded-t-xl object-cover"
            />
            <div className="flex flex-col h-full p-3 gap-1 bg-gray-700 rounded-b-xl">
                {/* Title */}
                <h2 className="font-bold text-lg text-white">{courseJson?.name}</h2>

                {/* Description Centered */}
                <div className="flex-1 flex items-center">
                    <p className="text-gray-400 line-clamp-3 text-sm w-full">
                        {courseJson?.description}
                    </p>
                </div>

                {/* Bottom Section: Progress & Button */}
                <div>
                    <h2 className="flex justify-between text-white my-2">
                        Progress
                        <span>{calculateProgress()}%</span>
                    </h2>
                    <Progress value={calculateProgress()} />
                    <Link href={"/workspace/view-course/" + course?.cid}>
                        <Button className="w-full mt-2">
                            <PlayCircle />
                            Continue Learning
                        </Button>
                    </Link>
                </div>
            </div>
        </div>

    )
}

export default EnrolledCourseCard
