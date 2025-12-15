import { OrganizationSwitcher, SignedIn, SignOutButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const TopBar = () => {
  return (
    <nav className='topbar relative'>
      <Link href="/" className='flex items-center gap-4 m-4'>
        <Image src="/logo.svg" alt="logo" width={28} height={28}/>
        <p className='text-heading3-bold text-light-1 max-xs:hidden'>Threads</p>
      </Link> 
      <div className='flex items-center gap-1'>
        <div className='block sm:hidden'>
          <SignedIn>
            <SignOutButton>
              <div className='flex cursor-pointer'>
                <Image src="/logout.svg" alt="logout" width={24} height={24}/>
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}

export default TopBar