"use client"
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import React from 'react'
import { mytest } from '../api/test/route'
import { MainNav } from '@/components/shared/MainNav'
import { dashboardConfig } from '@/constant/dashboard'
import { SiteFooter } from '@/components/shared/Footer'
import { DashboardShell } from '@/components/shared/Shell'

const page = () => {
  const handleSubmit = () => {
    mytest()
  }
  return (
    <DashboardShell>
      {/* <DashboardHeader heading="Posts" text="Create and manage posts.">
        <PostCreateButton />
      </DashboardHeader>
      <div>
        {posts?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any posts yet. Start creating content.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div> */}
    </DashboardShell>
  )
}

export default page