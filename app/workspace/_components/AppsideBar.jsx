"use client"

import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Book, Compass, LayoutDashboard, PencilRulerIcon, UserCircle2Icon, WalletCards } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddNewCourseDialog from "./AddNewCourseDialog";
import AI_LearnLab_Logo from "./AI_LearnLab_Logo";
import { cn } from "@/lib/utils";

export function AppsideBar() {

    const path = usePathname();
    const SideBarOptions = [
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/workspace'
        },
        {
            title: 'My Learning',
            icon: Book,
            path: '/workspace/my-learning'
        },
        {
            title: 'Explore Courses',
            icon: Compass,
            path: '/workspace/explore'
        },
        {
            title: 'Billing',
            icon: WalletCards,
            path: '/workspace/billing'
        },
        {
            title: 'Profile',
            icon: UserCircle2Icon,
            path: '/workspace/profile'
        }

    ]
    return (

        <Sidebar>
            <SidebarHeader className="bg-slate-700 p-4 flex items-center justify-center rounded-tr-4xl">
                <AI_LearnLab_Logo width={160} height={50} />
            </SidebarHeader>

            <SidebarContent >
                <SidebarGroup>
                    <AddNewCourseDialog>
                        <Button className={'bg-white text-black hover:text-black hover:bg-white hover:cursor-pointer mt-1'}>Create New Course</Button>
                    </AddNewCourseDialog>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupContent >
                        <SidebarMenu>
                            {SideBarOptions.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            href={item.path}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                                path === item.path
                                                    ? "bg-slate-700 text-white"
                                                    : "text-white hover:bg-slate-600"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}