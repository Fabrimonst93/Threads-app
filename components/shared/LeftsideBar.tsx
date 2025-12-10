"use client"

import {sidebarLinks} from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { SignedIn, SignOutButton, useAuth } from '@clerk/nextjs'


const LeftsideBar = () => {
  const router = useRouter()
  const pathname = usePathname()

  const { userId } = useAuth()
  
  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex flex-col w-full flex-1 gap-6 px-6 pt-6'>
        {sidebarLinks.map((link)=> {
          const isActive = (pathname.includes(link.route) && link.route.length > 1 ) || pathname === link.route;
          if (link.route === "/profile") {
              if (userId) {
                  link.route = `/profile/${userId}`
              } else {
                  // Optional: If no user, prevent link or redirect to sign-in
                  return null; 
              }
          }
          return (
            <Link 
              href={link.route}
              key={link.label}
              className={`p-4 leftsidebar_link ${isActive && "bg-primary-500"}`}
            >
              <Image 
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24} 
              />
              <p className='text-light-1 max-lg:hidden'>{link.label}</p>
            </Link>
          )
          })}
      </div>

      <div className='mt-10 px-6'>
        <SignedIn>
          <SignOutButton redirectUrl="/sign-in">
            <div className='flex cursor-pointer gap-4 p-4'>
              <Image src="/logout.svg" alt="logout" width={24} height={24}/>
              <p className='text-light-1 max-lg:hidden'>Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  ) 
}

export default LeftsideBar