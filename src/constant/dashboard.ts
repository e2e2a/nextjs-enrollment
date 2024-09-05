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
    /**
     * @todo think of way if this is to remove or not
     * advantage to display courses is having a description to read by students
     */
    // {
    //   title: 'Subjects',
    //   i: [
    //     {
    //       title: `Nursery`,
    //       href: '/admin/subjects',
    //       icon: 'eye',
    //     },
    //     {
    //       title: `Kindergarten 1&2`,
    //       href: '/admin/subjects',
    //       icon: 'eye',
    //     },
    //     {
    //       title: `Junior High School`,
    //       href: '/admin/subjects',
    //       icon: 'eye',
    //     },
    //     {
    //       title: 'Senior High School',
    //       href: '/admin/subjects/add',
    //       icon: 'add',
    //     },
    //     {
    //       title: 'College',
    //       href: '/admin/subjects/add',
    //       icon: 'add',
    //     },
    //   ],
    //   icon: 'libraryBig',
    // },
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
    // {
    //   title: 'Educational Categories',
    //   i: [
    //     // {
    //     //   title: 'Nursery',
    //     //   href: '/admin/courses/categories?category=Nursery',
    //     //   icon: 'eye',
    //     // },
    //     // {
    //     //   title: 'Kindergarten 1&2',
    //     //   href: '/admin/courses/categories?category=Kindergarten 1&2',
    //     //   icon: 'eye',
    //     // },
    //     // {
    //     //   title: 'Junior High School',
    //     //   href: '/admin/courses/categories?category=Junior High School',
    //     //   icon: 'eye',
    //     // },
    //     // {
    //     //   title: 'Senior High School',
    //     //   href: '/admin/courses/categories?category=Senior High School',
    //     //   icon: 'eye',
    //     // },
    //     // {
    //     //   title: 'Tesda',
    //     //   href: '/admin/courses/categories?category=Tesda',
    //     //   icon: 'eye',
    //     // },
    //     // {
    //     //   title: 'College',
    //     //   // href: '/admin/courses/categories?category=College',
    //     //   icon: 'eye',
    //     // },

    //   ],
    //   icon: 'bookOpenText',
    // },
    {
      title: 'Junior High School',
      i: [
        {
          title: 'Sections',
          i: [
            {
              title: 'Section Management',
              href: '/admin/courses/blocks',
              icon: 'eye',
            },
            {
              title: 'Add Section',
              href: '/admin/courses/blocks/add',
              icon: 'add',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Level Management',
          href: '/admin/courses/blocks',
          icon: 'eye',
        },
        {
          title: 'Add Level',
          href: '/admin/courses/blocks/add',
          icon: 'add',
        },
      ],
      icon: 'bookOpenText',
    },
    {
      title: 'Senior High School',
      i: [
        {
          title: 'Sections',
          i: [
            {
              title: 'Section Management',
              href: '/admin/courses/blocks',
              icon: 'eye',
            },
            {
              title: 'Add Section',
              href: '/admin/courses/blocks/add',
              icon: 'add',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Strand/Tracks Management',
          href: '/admin/courses/blocks',
          icon: 'eye',
        },
        {
          title: 'Add Strand/Tracks',
          href: '/admin/courses/blocks/add',
          icon: 'add',
        },
      ],
      icon: 'bookOpenText',
    },
    {
      title: 'Tesda',
      i: [
        {
          title: 'Blocks',
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
          title: 'Course Management',
          href: '/admin/courses/blocks',
          icon: 'eye',
        },
        {
          title: 'Add Course',
          href: '/admin/courses/blocks/add',
          icon: 'add',
        },
      ],
      icon: 'bookOpenText',
    },
    {
      title: 'College',
      i: [
        {
          title: 'Blocks',
          i: [
            {
              title: 'Block Management',
              href: '/admin/college/courses/blocks',
              icon: 'eye',
            },
            {
              title: 'Add Block',
              href: '/admin/college/courses/blocks/add',
              icon: 'add',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Courses',
          i: [
            {
              title: 'Course Management',
              href: '/admin/college/courses',
              icon: 'eye',
            },
            {
              title: 'Add Course',
              href: '/admin/college/courses/add',
              icon: 'add',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Subjects',
          i: [
            {
              title: 'Subject Management',
              href: '/admin/college/subjects',
              icon: 'eye',
            },
            {
              title: 'Add Subject',
              href: '/admin/college/subjects/add',
              icon: 'add',
            },
          ],
          icon: 'packageSearch',
        },
        // {
        //   title: 'Course Management',
        //   href: '/admin/courses/blocks',
        //   icon: 'eye',
        // },
        // {
        //   title: 'Add Course',
        //   href: '/admin/college/courses/add',
        //   icon: 'add',
        // },
      ],
      icon: 'bookOpenText',
    },
    // {
    //   title: 'Courses',
    //   i: [
    //     {
    //       title: 'Course Blocks',
    //       i: [
    //         {
    //           title: 'Block Management',
    //           href: '/admin/courses/blocks',
    //           icon: 'eye',
    //         },
    //         {
    //           title: 'Add Block',
    //           href: '/admin/courses/blocks/add',
    //           icon: 'add',
    //         },
    //       ],
    //       icon: 'packageSearch',
    //     },

    //     {
    //       title: 'Add Course',
    //       href: '/admin/courses/add',
    //       icon: 'add',
    //     },
    //     // {
    //     //   title: 'Course Management',
    //     //   href: '/admin/courses',
    //     //   icon: 'libraryBig',
    //     // },
    //   ],
    //   icon: 'libraryBig',
    // },
    // {
    //   title: 'Enrollment',
    //   i: [
    //     {
    //       title: 'Enrollment Process',
    //       i: [
    //         {
    //           title: 'Step 1 Management',
    //           href: '/admin/enrollment/management?step=1',
    //           icon: 'eye',
    //         },
    //         {
    //           title: 'Step 2 Management',
    //           href: '/admin/enrollment/management?step=2',
    //           icon: 'eye',
    //         },
    //         {
    //           title: 'Step 3 Management',
    //           href: '/admin/enrollment/management?step=3',
    //           icon: 'eye',
    //         },
    //         {
    //           title: 'Step 4 Management',
    //           href: '/admin/enrollment/management?step=4',
    //           icon: 'eye',
    //         },
    //       ],
    //       icon: 'packageSearch',
    //     },
    //     {
    //       title: 'Course Inventory',
    //       href: '/admin/courses',
    //       icon: 'libraryBig',
    //     },
    //     {
    //       title: 'Add Course',
    //       href: '/admin/courses/add',
    //       icon: 'add',
    //     },
    //   ],
    //   icon: 'graduationCap',
    // },
    // // {
    // //   title: 'Classes',
    // //   href: '/',
    // //   icon: 'fileBadge',
    // // },
    // {
    //   title: 'Schedules',
    //   i: [
    //     {
    //       title: `Professor's Schedules`,
    //       href: '/courses',
    //       icon: 'eye',
    //     },
    //     {
    //       title: `Schedules Management`,
    //       href: '/admin/schedules',
    //       icon: 'eye',
    //     },
    //     {
    //       title: 'Add Professor Schedules',
    //       href: '/admin/courses/add',
    //       icon: 'add',
    //     },
    //   ],
    //   icon: 'timer',
    // },
    // {
    //   title: 'Subjects',
    //   i: [
    //     {
    //       title: `Subject Management`,
    //       href: '/admin/subjects',
    //       icon: 'eye',
    //     },
    //     {
    //       title: 'Add Subject',
    //       href: '/admin/subjects/add',
    //       icon: 'add',
    //     },
    //   ],
    //   icon: 'notebook',
    // },
    {
      title: 'User Roles',
      i: [
        
        {
          title: `Admins Management`,
          href: '/admin/subjects',
          icon: 'userSearch',
        },
        {
          title: 'Deans Management',
          href: '/admin/subjects/add',
          icon: 'userSearch',
        },
        {
          title: 'Role Teacher',
          i: [
            {
              title: 'Teachers Management',
              href: '/admin/users/teachers',
              icon: 'eye',
            },
            {
              title: 'Add Teacher',
              href: '/admin/users/teachers/add',
              icon: 'add',
            },
          ],
          icon: 'userSearch',
        },
        {
          title: 'Role Student',
          i: [
            {
              title: 'Students Management',
              href: '/admin/users/students',
              icon: 'eye',
            },
            {
              title: 'Add Student',
              href: '/admin/users/students/add',
              icon: 'add',
            },
          ],
          icon: 'userSearch',
        },
      ],
      icon: 'usersRound',
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
