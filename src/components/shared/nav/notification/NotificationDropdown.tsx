'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icons } from '../../Icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useRef, useState } from 'react';
import Content from './Content';
import { useNotificationQueryBySessionId } from '@/lib/queries/notification/get/session';
import Loader from '../../Loader';

interface IProps {
  session: any;
}

export function NotificationDropdown({ session }: IProps) {
  const [fresh, setFresh] = useState(0);
  const [oldNotifications, setOldNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const [hideButton, setHideButton] = useState(false);
  const [showNotifSkeleton, setShowNotifSkeleton] = useState(false);
  const [showOldNotif, setShowOldNotif] = useState(false);
  const [showNoMoreNotif, setShowNoMoreNotif] = useState(false);

  const { data, isLoading, error } = useNotificationQueryBySessionId(session?.user?.id, 'FRESH');
  const { data: oldData, error: oldError } = useNotificationQueryBySessionId(session?.user?.id, 'OLD', visibleCount);

  const showNoMoreNotifRef = useRef(false);
  const showClickShowMoreRef = useRef(false);

  const handleShowMore = () => {
    setHideButton(true);
    showClickShowMoreRef.current = true;
    if (!showNoMoreNotifRef.current) {
      setShowNotifSkeleton(true);
    } else {
      setShowNotifSkeleton(false);
    }
    setTimeout(() => {
      setShowOldNotif(true);
      setVisibleCount((prevCount) => {
        const newCount = prevCount + 6;
        return newCount;
      });
    }, 2000);
  };

  const handleShowMoreScroll = () => {
    if (!showClickShowMoreRef.current) return;

    if (!showNoMoreNotifRef.current) {
      setShowNotifSkeleton(true);
    } else {
      setShowNotifSkeleton(false);
      return;
    }
    setTimeout(() => {
      setShowOldNotif(true);
      setVisibleCount((prevCount) => {
        const newCount = prevCount + 6;
        return newCount;
      });
    }, 2000);
  };

  useEffect(() => {
    if (error || !data) return;
    if (oldError || !oldData) return;
    if (data) {
      if (data?.notifications) {
        setNotifications(data?.notifications);
        setFresh(data?.notifications?.length);
      }
    }
    if (!showNoMoreNotif && (visibleCount > 0 || data?.notifications?.length === 0)) {
      if (data?.notifications?.length === 0 && !hideButton) {
        setVisibleCount(6);
        setShowOldNotif(true);
      }
      if (oldData && oldData?.notifications) {
        if (oldData.error && oldData.type === 'show more') {
          showNoMoreNotifRef.current = true;
          setShowNoMoreNotif(true);
          setShowNotifSkeleton(false);
        }
        setOldNotifications(oldData?.notifications);
        setShowNotifSkeleton(false);
      }
    }
    setIsPageLoading(false);
  }, [data, error, oldData, oldError, showNoMoreNotif, visibleCount, hideButton]);

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
          <DropdownMenuContent
            align='center'
            className='bg-white px-0 lg:z-20 md:z-50 mr-5'
            style={{
              maxHeight: `calc(var(--viewport-height) - 70px)`, // Inline style for dynamic max-height
            }}
          >
            {/* <UserAvatarTabs /> */}
            <div className=''>
              {isPageLoading ? (
                <Loader />
              ) : (
                <Content
                  showNoMoreNotif={showNoMoreNotif}
                  showNotifSkeleton={showNotifSkeleton}
                  showOldNotif={showOldNotif}
                  oldNotifications={oldNotifications}
                  notifications={notifications}
                  hideButton={hideButton}
                  handleShowMoreScroll={handleShowMoreScroll}
                  handleShowMore={handleShowMore}
                />
              )}
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
