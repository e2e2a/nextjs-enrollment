"use client"
import React from 'react'
// import { mytest } from '../api/test/route'
import { DashboardShell } from '@/components/shared/Shell'
import { UseUserQuery } from '@/lib/queries'

const page = () => {
  // const handleSubmit = () => {
  //   mytest()
  // }
  const { data: res, error } = UseUserQuery();
  if (error) {
    console.error(error)
    return null
  }
  return (
    <DashboardShell>
      {/* <DashboardHeader heading="Posts" text="Create and manage posts.">
        <PostCreateButton />
      </DashboardHeader> */}
      <div>
        {/* {res && res.users ? (
          <div className="divide-y divide-border rounded-md border">
            
          </div>
        ) : (
        //   <EmptyPlaceholder>
        //     <EmptyPlaceholder.Icon name="post" />
        //     <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
        //     <EmptyPlaceholder.Description>
        //       You don&apos;t have any posts yet. Start creating content.
        //     </EmptyPlaceholder.Description>
        //     <PostCreateButton variant="outline" />
        //   </EmptyPlaceholder>
        // )}
        null )} */}
      </div>
    </DashboardShell>
  )
}

export default page