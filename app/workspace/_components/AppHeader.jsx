// import { SidebarTrigger } from '@/components/ui/sidebar'
// import { UserButton } from '@clerk/nextjs'
// import React from 'react'

// const AppHeader = () => {
//   return (
//     <div className='flex justify-between items-center px-4 py-3 shadow-sm bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700'>

//       <SidebarTrigger className='text-white' />

//       <UserButton afterSignOutUrl='/' />
//     </div>
//   )
// }

// export default AppHeader

// "use client"

// import React from 'react'
// // import ChapterListSheet from './ChapterListSheet' // new sheet-based sidebar
// import { UserButton } from '@clerk/nextjs'
// import ChapterListSheet from '@/app/course/_components/ChapterListSheet'

// const AppHeader = ({ courseInfo }) => {
//   return (
//     <div className='flex justify-between items-center px-4 py-3 shadow-sm bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700'>
//       {/* Sheet trigger with chapter list inside */}
//       <ChapterListSheet courseInfo={courseInfo} />

//       {/* Clerk user button */}
//       <UserButton afterSignOutUrl='/' />
//     </div>
//   )
// }

// export default AppHeader


"use client"

import React from 'react'
import { UserButton } from '@clerk/nextjs'
import ChapterListSheet from '@/app/course/_components/ChapterListSheet'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AI_LearnLab_Logo from './AI_LearnLab_Logo'

const AppHeader = ({ courseInfo }) => {
  return (
    <div className='flex justify-between items-center px-6 py-3 shadow-sm bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 w-[99%] mx-auto rounded-b-4xl my-'>
      <div className='flex items-center gap-3'>
        {
          courseInfo ? (
            <ChapterListSheet courseInfo={courseInfo} />
          ) : (
            <SidebarTrigger className='text-black bg-white hover:cursor-pointer hover:text-black hover:bg-white w-9 h-9 size-9' />
          )
        }
        <Link href="/workspace">
          <Button variant="ghost" size="icon" className="text-black bg-white hover:cursor-pointer hover:text-black hover:bg-white">
            <Home className="size-5" />
          </Button>
        </Link>
      </div>
      <AI_LearnLab_Logo width={160} height={50} />
      <UserButton afterSignOutUrl='/' />
    </div>
  )
}

export default AppHeader
