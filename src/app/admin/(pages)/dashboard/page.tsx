'use client';
import { Button } from '@/components/ui/button';
// import { Search } from "@/app/examples/dashboard/components/search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from './components/Overview';
import TertiaryContent from './components/Tertiary/TertiaryContent';

export default function Page() {
  return (
    <>
      <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
        <div className='flex-col md:flex'>
          <div className='flex-1 space-y-4 p-2 pt-1'>
            <div className='flex items-center justify-between space-y-2'>
              <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
              <div className='flex items-center space-x-2'>
                {/* <CalendarDateRangePicker /> */}
                <Button>Download</Button>
              </div>
            </div>
            <Tabs defaultValue='overview' className='space-y-4'>
              <TabsList>
                <TabsTrigger value='overview' >Overview</TabsTrigger>
                <TabsTrigger value='tertiary'>Tertiary</TabsTrigger>
                <TabsTrigger value='reports' disabled>
                  Vocational
                </TabsTrigger>
                <TabsTrigger value='notifications' disabled>
                  Secondary
                </TabsTrigger>
              </TabsList>
              <TabsContent value='overview' className='space-y-4'>
                <div className='grid gap-4 md:grid-cols-2 '>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                        <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>$45,231.89</div>
                      <p className='text-xs text-muted-foreground'>+20.1% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                      <CardTitle className='text-sm font-medium'>Active Now</CardTitle>
                      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                        <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className='text-2xl font-bold'>+573</div>
                      <p className='text-xs text-muted-foreground'>+201 since last hour</p>
                    </CardContent>
                  </Card>
                </div>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'></div>
                <Card className='col-span-4'>
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className='pl-2'>
                    <Overview />
                  </CardContent>
                </Card>
              </TabsContent>
              <TertiaryContent />
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
