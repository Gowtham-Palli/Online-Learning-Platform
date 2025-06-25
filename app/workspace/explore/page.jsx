"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { LoaderCircleIcon, LoaderIcon, Settings } from 'lucide-react'
import React, { useState } from 'react'

const Explore = () => {
  const [loading, setloading]=useState(false);
  const onGenerate=async()=>{
    try{
      setloading(true);
      const result = await axios.post('/api/generate-random');
      console.log('gen', result.data);
    }catch(e){
      console.log(e);
    }finally{
      setloading(false);
    }

  }

  return (
    <div>
      <h2 className='text-white text-2xl'>Explore more courses</h2>
        {/* <Button onClick={onGenerate}>{loading?<LoaderCircleIcon className={'animate-spin'}/>:<Settings/>}
        Generate Random Course</Button> */}
    </div>
  )
}

export default Explore
