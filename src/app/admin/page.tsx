"use client"
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import React from 'react'
import { mytest } from '../api/test/route'

const page = () => {
  const session = useSession()
  console.log(session)
  const handleSubmit = () => {
    mytest()
  }
  return (
    <>
    <div>Welcome {session.data?.user.firstname}</div>
    <Button onClick={handleSubmit}>Click me</Button>
    </>
  )
}

export default page