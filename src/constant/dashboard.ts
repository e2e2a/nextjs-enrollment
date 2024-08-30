import { DashboardConfig } from '@/types';

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: 'Home',
      href: '/',
      icon: 'home',
    },
    {
      title: 'Courses',
      href: '/courses',
      icon: 'libraryBig',
    },
    {
      title: 'Enrollment',
      href: '/enrollment',
      icon: 'graduationCap',
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
      icon: 'notebook',
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
      icon: 'graduationCap',
    },
    {
      title: 'Subjects',
      href: '/courses',
      icon: 'notebook',
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
  sidebarAdmin: [
    {
      title: 'Courses',
      i: [
        {
          title: 'Course Blocks',
          i: [
            {
              title: 'Block Management',
              href: '/admin/courses/blocks',
              icon: 'eye',
            },
            {
              title: 'Add Block',
              href: '/admin/courses/blocks/add',
              icon: 'add',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Preview Course Page',
          href: '/courses',
          icon: 'eye',
        },
        {
          title: 'Course Inventory',
          href: '/admin/courses',
          icon: 'libraryBig',
        },
        {
          title: 'Add Course',
          href: '/admin/courses/add',
          icon: 'add',
        },
      ],
      icon: 'libraryBig',
    },
    {
      title: 'Enrollment',
      i: [
        {
          title: 'Enrollment Process',
          i: [
            {
              title: 'Step 1 Management',
              href: '/admin/enrollment/management?step=1',
              icon: 'eye',
            },
            {
              title: 'Step 2 Management',
              href: '/admin/enrollment/management?step=2',
              icon: 'eye',
            },
            {
              title: 'Step 3 Management',
              href: '/admin/enrollment/management?step=3',
              icon: 'eye',
            },
            {
              title: 'Step 4 Management',
              href: '/admin/enrollment/management?step=4',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Course Inventory',
          href: '/admin/courses',
          icon: 'libraryBig',
        },
        {
          title: 'Add Course',
          href: '/admin/courses/add',
          icon: 'add',
        },
      ],
      icon: 'graduationCap',
    },
    // {
    //   title: 'Classes',
    //   href: '/',
    //   icon: 'fileBadge',
    // },
    {
      title: 'Subjects',
      href: '/courses',
      icon: 'notebook',
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
