import React, { useState } from 'react';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Loader2Icon, Sparkle } from 'lucide-react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';

const AddNewCourseDialog = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);
    const [pendingCourseId, setPendingCourseId] = useState(null);
    const [pendingFormData, setPendingFormData] = useState(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        includeVideo: true,
        noOfChapters: 5,
        category: '',
        level: '',
        // Remove bannerImageUrl from initial state
    });

    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const onGenerate = async () => {
        const courseId = uuidv4();

        try {
            setLoading(true);
            const result = await axios.post('/api/generate-course-layout', {
                ...formData,
                courseId,
            });
            setLoading(false);
            router.push('/workspace/edit-course/' + result.data?.courseId);
        } catch (e) {
            setLoading(false);

            if (e.response?.data?.error === 'IMAGE_GENERATION_FAILED') {
                // Show image upload UI
                setPendingFormData(formData);
                setPendingCourseId(courseId);
                setShowImageUpload(true);
                alert(e.response.data.message);
            }
            else if (e.response?.data?.error === 'MISSING_BANNER_IMAGE') {
                alert("Please upload a course banner image");
            }
            else {
                console.error(e);
                alert('Failed to generate course');
            }
        }
    };

    // Called after user uploads their own image
    const onManualImageUpload = async (url) => {
        if (!pendingFormData || !pendingCourseId) return;
        setLoading(true);
        try {
            const result = await axios.post('/api/generate-course-layout', {
                ...pendingFormData,
                courseId: pendingCourseId,
                bannerImageUrl: url,
            });
            setLoading(false);
            router.push('/workspace/edit-course/' + result.data?.courseId);
        } catch (e) {
            setLoading(false);
            alert('Failed to generate course after uploading image');
        }
    };


    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Your Course Using AI</DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="flex flex-col gap-1 ">
                                <label className='text-gray-700 font-semibold'>Course Name</label>
                                <Input
                                    placeholder="Course Name"
                                    value={formData.name}
                                    onChange={e => onHandleInputChange('name', e.target.value)}
                                    className={"bg-slate-800 text-blue-300"}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className='text-gray-700 font-semibold'>Course Description (Optional)</label>
                                <Textarea
                                    placeholder="Course Description"
                                    value={formData.description}
                                    onChange={e => onHandleInputChange('description', e.target.value)}
                                    className={"bg-slate-800 text-blue-300"}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className='text-gray-700 font-semibold'>No. of Chapters</label>
                                <Input
                                    type="number"
                                    value={Number.isNaN(formData.noOfChapters) ? '' : formData.noOfChapters}
                                    onChange={e => onHandleInputChange('noOfChapters', e.target.value)}
                                    className={"bg-slate-800 text-blue-300"}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className='text-gray-700 font-semibold'>Include Video</label>
                                <Switch
                                    checked={formData.includeVideo}
                                    onCheckedChange={checked => onHandleInputChange('includeVideo', checked)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className='text-gray-700 font-semibold'>Difficulty Level</label>
                                <Select
                                    value={formData.level}
                                    onValueChange={value => onHandleInputChange('level', value)}
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
                            <div className="flex flex-col gap-1">
                                <label className='text-gray-700 font-semibold'>Category</label>
                                <Input
                                    placeholder="Category (Separated by comma)"
                                    value={formData.category}
                                    onChange={e => onHandleInputChange('category', e.target.value)}
                                    className={"bg-slate-800 text-blue-300"}
                                />
                            </div>


                            <div className="mt-5">
                                <Button className="w-full" onClick={onGenerate} disabled={loading || showImageUpload}>
                                    {loading ? <Loader2Icon className="animate-spin" /> : <Sparkle />}
                                    Generate Course
                                </Button>
                            </div>
                            {/* Show image upload only if AI generation failed */}
                            {showImageUpload && (
                                <div className="mt-5 flex flex-col gap-1">
                                    <label className='text-gray-700 font-semibold'>Please upload a banner image</label>
                                    <ImageUploader onImageUploaded={onManualImageUpload} />
                                </div>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
export default AddNewCourseDialog