import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { AppsideBar } from './_components/AppsideBar'
import AppHeader from './_components/AppHeader'

const WorkspaceProvider = ({ children }) => {

    return (
        <SidebarProvider>
            <AppsideBar />
            <div className='w-full '>
                <AppHeader/>
                <div className='p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 w-[99%] mx-auto my-2 rounded-4xl'>
                    {children}
                </div>
            </div>
        </SidebarProvider>
    )
}

export default WorkspaceProvider
