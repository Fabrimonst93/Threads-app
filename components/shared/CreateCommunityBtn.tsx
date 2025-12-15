"use client"

import React from 'react'
import { Button } from '../ui/button'
import { CreateOrganization } from '@clerk/nextjs'

const CreateCommunityBtn = () => {
    const handleClick = () => {
        
    }


  return (
    <Button onClick={handleClick} size='sm' className='m-5 community-card_btn bg-primary-500 hover:bg-dark-4 hover:cursor-pointer'>
        Crear comunidad
    </Button>
  )
}

export default CreateCommunityBtn