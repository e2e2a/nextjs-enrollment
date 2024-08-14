"use client"
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const we = useParams()
  console.log(we.id)
  return (
    <div>id</div>
  )
}

export default page