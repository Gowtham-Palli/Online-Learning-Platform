import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Loader2Icon, Sparkle } from 'lucide-react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const AddNewCourseDialog = ({ children }) => {
    const [loading, setloading] = useState(false);
    const router = useRouter();

    const [formData, setformData] = useState({
        name: '',
        description: '',
        includeVideo: true,
        noOfChapters: 5,
        category: '',
        level: '',
    });

    const onHandleInputChange = (field, value) => {
        setformData(prev => ({
            ...prev,
            [field]: value,
        }));
    };


    const onGenerate = async () => {
        const courseId = uuidv4();
        try {
            setloading(true);
            const result = await axios.post('/api/generate-course-layout', {
                ...formData,
                courseId: courseId
            });
            setloading(false);
            router.push('/workspace/edit-course/'+result.data?.courseId)
        }
        catch (e) {
            setloading(false);
            console.log(e)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Your Course Using Ai</DialogTitle>
                    <DialogDescription asChild>
                        <div className='flex flex-col gap-3 mt-2'>
                            <div>
                                <label>Course Name</label>
                                <Input
                                    placeholder='Course Name'
                                    value={formData.name}
                                    onChange={(e) => onHandleInputChange('name', e?.target.value)}
                                />
                            </div>
                            <div>
                                <label>Course Description (Optional)</label>
                                <Textarea
                                    placeholder='Course Description'
                                    value={formData.description}
                                    onChange={(e) => onHandleInputChange('description', e?.target.value)}
                                />
                            </div>
                            <div>
                                <label>No. of Chapters</label>
                                <Input
                                    type="number"
                                    
                                    value={Number.isNaN(formData.noOfChapters) ? '' : formData.noOfChapters}
                                    onChange={(e) => onHandleInputChange('noOfChapters', e.target.value)}
                                />
                            </div>
                            <div className='flex items-center gap-3'>
                                <label>Include Video</label>
                                <Switch
                                    checked={formData.includeVideo}
                                    onCheckedChange={(checked) => onHandleInputChange('includeVideo', checked)}
                                />
                            </div>
                            <div>
                                <label>Difficulty Level</label>
                                <Select
                                    value={formData.level}
                                    onValueChange={(value) => onHandleInputChange('level', value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Difficulty Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Moderate">Moderate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label>Category</label>
                                <Input
                                    placeholder='Category (Separated by comma)'
                                    value={formData.category}
                                    onChange={(e) => onHandleInputChange('category', e?.target.value)}
                                />
                            </div>
                            <div className='mt-5'>
                                <Button className={'w-full'} onClick={onGenerate} disabled={loading}>
                                    {loading ? <Loader2Icon className='animate-spin' /> : <Sparkle />}
                                    Generate Course
                                </Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewCourseDialog