import { DashboardConfig } from '@/types';

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: 'Home',
      href: '/',
      icon: 'home'
    },
    {
      title: 'Courses',
      href: '/courses',
      icon: 'libraryBig'
    },
    {
      title: 'Enrollment',
      href: '/enrollment',
      icon: 'graduationCap'
    },
    // {
    //   title: 'Classes',
    //   href: '/prospectus',
    //   icon: 'fileBadge',
    //   // disabled: true,
    // },
    {
      title: 'Subjects',
      href: '/subjects',
      icon: 'notebook'
    },
    {
      title: 'Records',
      href: '/records',
      icon: 'fileStack',
    },
  ],
  sidebarNav: [
    // {
    //   title: 'Home',
    //   href: '/',
    //   icon: 'home',
    // },
    {
      title: 'Courses',
      href: '/courses',
      icon: 'libraryBig',
    },
    // {
    //   title: 'Classes',
    //   href: '/',
    //   icon: 'fileBadge',
    // },
    {
      title: 'Enrollment',
      href: '/enrollment',
      icon: 'graduationCap'
    },
    {
      title: 'Subjects',
      href: '/courses',
      icon: 'notebook'
    },
    {
      title: 'Records',
      href: '/',
      icon: 'fileStack',
    },
    {
      title: 'School & Policies',
      href: '/',
      icon: 'school',
    },
    {
      title: 'Documentation',
      href: '/',
      icon: 'page',
    },
    // {
    //   title: 'Billing',
    //   href: '/dashboard/billing',
    //   icon: 'billing',
    // },
    // {
    //   title: 'Settings',
    //   href: '/dashboard/settings',
    //   icon: 'settings',
    // },
  ],
};