'use client';
import { Button } from '@/components/ui/button';
// import { Search } from "@/app/examples/dashboard/components/search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TertiaryContent from './components/Tertiary/TertiaryContent';
import MainOverview from './components/MainOverview';

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
                <Button className='hidden'>Download</Button>
              </div>
            </div>
            <Tabs defaultValue='overview' className='space-y-4'>
              <TabsList>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='tertiary'>Tertiary</TabsTrigger>
                <TabsTrigger value='reports' disabled>
                  Vocational
                </TabsTrigger>
                <TabsTrigger value='notifications' disabled>
                  Secondary
                </TabsTrigger>
              </TabsList>
              {/* @tabs */}
              <MainOverview />
              <TertiaryContent />
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
