'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icons } from '../../Icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
import Content from './Content';
import { useNotificationQueryBySessionId } from '@/lib/queries/notification/get/session';
import Loader from '../../Loader';

// const notifications = [
//   {
//     title: 'Your call has been confirmed.',
//     type: 'fresh',
//     description: '1 hour ago',
//   },
//   {
//     title: 'Your call has been confirmed.',
//     type: 'fresh',
//     description: '1 hour ago',
//   },
//   {
//     title: 'Your call has been confirmed.',
//     type: 'old',
//     description: '1 hour ago',
//   },
// ];

interface IProps {
  session: any;
}
export function NotificationDropdown({ session }: IProps) {
  const [fresh, setFresh] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [hideButton, setHideButton] = useState(false);
  const { data, isLoading, error } = useNotificationQueryBySessionId(session?.user?.id, 'FRESH');
  const { data: oldData, error: oldError } = useNotificationQueryBySessionId(session?.user?.id, 'OLD', visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => {
      const newCount = prevCount + 5;
      // setCurrentNotifications(notifications.slice(0, newCount));
      return newCount;
    });
  };
  useEffect(() => {
    if (error || !data) return;

    if (data) {
      if (data.notifications) {
        const freshCount = data.notifications.filter((notification: any) => notification.type === 'FRESH').length;
        setNotifications(data?.notifications)
        setFresh(freshCount);
        setIsPageLoading(false);
      }
      if(data.error && data.type === 'show more'){
        setHideButton(true)
      }
    }
  }, [data, error]);
  console.log('data',data)
  const updateViewportDimensions = () => {
      const root = document.documentElement;
      root.style.setProperty('--viewport-width', `${window.innerWidth}px`);
      root.style.setProperty('--viewport-height', `${window.innerHeight}px`);
    };
  
    useEffect(() => {
      // Update dimensions on component mount
      updateViewportDimensions();
  
      // Add event listener for window resize
      window.addEventListener('resize', updateViewportDimensions);
  
      // Cleanup listener on component unmount
      return () => {
        window.removeEventListener('resize', updateViewportDimensions);
      };
    }, []);
  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className='select-none outline-none transition-transform duration-0 active:opacity-85 rounded-full bg-slate-200 p-[6.5px]'>
            <TooltipTrigger asChild>
              <div className='active:scale-[98.5%] relative  rounded-full transition-transform duration-0 active:opacity-95 '>
                <Icons.bell className='h-7 w-7 fill-white animate-wiggle duration-400 transition-transform' />
                {fresh > 0 && <div className='absolute px-1.5 py-[1.5px] top-[-12px] right-[-10px] bg-red text-white border-white border-opacity-40 border rounded-full text-[9px] font-bold'>{fresh}</div>}
              </div>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='center' className='bg-white px-0 lg:z-20 md:z-50 mr-5' style={{
          maxHeight: `calc(var(--viewport-height) - 70px)`, // Inline style for dynamic max-height
        }}>
            {/* <UserAvatarTabs /> */}
            <div className="">
            {isPageLoading ? <Loader /> : <Content notifications={notifications} hideButton={hideButton} handleShowMore={handleShowMore} />}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <audio id='audio_tag' ref={audioRef} src={'/ring2.mp3'} /> */}
        <TooltipContent className='bg-white py-1 px-2 mt-2'>
          <p className='text-sm'>Notification</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
