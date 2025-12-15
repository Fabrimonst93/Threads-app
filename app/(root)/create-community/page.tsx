import { CreateOrganization } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className='items-center justify-center flex mt-10'>
        <CreateOrganization 
            afterCreateOrganizationUrl="/communities" 
            skipInvitationScreen
      />
    </div>
  )
}

export default page