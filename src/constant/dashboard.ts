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
      href: '/courses/college',
      icon: 'libraryBig',
    },
    {
      title: 'Schedules',
      href: '/schedules',
      icon: 'hourglass',
    },
    {
      title: 'Receipts',
      href: '/receipts',
      icon: 'PhilippinePeso',
    },
    {
      title: 'Records',
      href: '/records',
      icon: 'fileStack',
    },
  ],
  sidebarNav: [
    {
      title: 'Courses',
      href: '/courses/college',
      icon: 'libraryBig',
    },
    {
      title: 'Enrollment',
      href: '/enrollment',
      icon: 'graduationCap',
    },
    {
      title: 'Schedules',
      href: '/schedules',
      icon: 'hourglass',
    },
    {
      title: 'Records',
      href: '/record',
      icon: 'fileStack',
    },
    {
      title: 'Remaining Fees',
      href: '/fee',
      icon: 'billing',
    },
    {
      title: 'Receipts',
      href: '/receipts',
      icon: 'PhilippinePeso',
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
    //   title: 'Settings',
    //   href: '/dashboard/settings',
    //   icon: 'settings',
    // },
  ],
  mainNavInstructor: [
    {
      title: 'Home',
      href: '/instructor',
      icon: 'home',
    },
    {
      title: 'Teaching Load',
      href: '/instructor/schedules',
      icon: 'hourglass',
    },
    {
      title: 'Grades Report',
      href: '/instructor/report/grade',
      icon: 'filePenLine',
    },
    {
      title: 'Records',
      href: '/instructor/record',
      icon: 'fileStack',
    },
  ],
  sidebarInstructor: [
    {
      title: 'Teaching Load',
      href: '/instructor/schedules',
      icon: 'hourglass',
    },
    {
      title: 'Grades Report',
      href: '/instructor/report/grade',
      icon: 'filePenLine',
    },
    {
      title: 'Records',
      href: '/instructor/record',
      icon: 'fileStack',
    },
    {
      title: 'School & Policies',
      href: '/school/policies',
      icon: 'school',
    },
    {
      title: 'Documentation',
      href: '/documentation',
      icon: 'page',
    },
  ],
  mainNavDean: [
    {
      title: 'Home',
      href: '/dean',
      icon: 'home',
    },
    {
      title: 'Teaching Load',
      href: '/dean/schedules',
      icon: 'hourglass',
    },
    {
      title: 'Department Load',
      href: '/dean/schedules/department',
      icon: 'CalendarDays',
    },
    {
      title: 'Blocks',
      href: '/dean/blocks',
      icon: 'packageSearch',
    },
    {
      title: 'Grades Report',
      href: '/dean/report/grade',
      icon: 'filePenLine',
    },
  ],
  sidebarDean: [
    {
      title: 'Blocks',
      href: '/dean/blocks',
      icon: 'packageSearch',
    },
    {
      title: 'Curriculums',
      i: [
        {
          title: 'Curriculum Management',
          href: '/dean/curriculums',
          icon: 'eye',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Teaching Load',
      href: '/dean/schedules',
      icon: 'hourglass',
    },
    {
      title: 'Department Load',
      href: '/dean/schedules/department',
      icon: 'CalendarDays',
    },
    {
      title: 'Enrollment',
      i: [
        {
          title: 'Enrollment Process',
          i: [
            {
              title: 'Step 1 Verify Enrollee Information',
              href: '/dean/enrollment/management?step=1',
              icon: 'eye',
            },
            {
              title: 'Step 2 Evaluate the Student',
              href: '/dean/enrollment/management?step=2',
              icon: 'eye',
            },
            {
              title: 'Step 3 Add Subjects of Enrollee',
              href: '/dean/enrollment/management?step=3',
              icon: 'eye',
            },
            {
              title: 'Step 4 Approval of Add/Drop Subject Request',
              href: '/dean/enrollment/management?step=4',
              icon: 'eye',
            },
            {
              title: 'Step 5 Student Payment',
              href: '/dean/enrollment/management?step=5',
              icon: 'eye',
            },
            {
              title: 'Step 6 Finalizing Student Enrollment',
              href: '/dean/enrollment/management?step=6',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Request Add/Drop/Withdraw',
          i: [
            {
              title: 'View Request Add',
              href: '/dean/enrollment/management?step=1',
              icon: 'eye',
            },
            {
              title: 'View Request Drop',
              href: '/dean/enrollment/management?step=2',
              icon: 'eye',
            },
            {
              title: 'View Request Withdraw',
              href: '/dean/enrollment/request/withdraw',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Enrolling Students',
          i: [
            {
              title: 'View Enrolling Students',
              href: '/dean/enrollment/enrolling',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Enrolled Students',
          i: [
            {
              title: 'View Enrolled Students',
              href: '/dean/enrollment/enrolled',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Temporary Enrolled',
          i: [
            {
              title: 'View Temporary Enrolled',
              href: '/dean/enrollment/temporary',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Recent Records',
          i: [
            {
              title: 'Enrollment Records',
              href: '/dean/enrollment/record/enrollment',
              icon: 'eye',
            },
            {
              title: 'Instructor Sched. Records',
              href: '/dean/enrollment/record/schedule',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Instructors Schedules',
      i: [
        {
          title: 'Instructors Schedule Management',
          href: '/dean/schedules/instructors',
          icon: 'eye',
        },
        {
          title: 'Add Instructor Schedules',
          href: '/dean/schedules/instructors/add',
          icon: 'add',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Reported Grades',
      i: [
        {
          title: 'Class Grades Report',
          href: '/dean/report/grade',
          icon: 'eye',
        },
        {
          title: 'Individual Grades Report',
          href: '/dean/report/grade/individual',
          icon: 'eye',
        },
      ],
      icon: 'filePenLine',
    },
    {
      title: 'Subjects',
      i: [
        {
          title: 'Subjects Management',
          href: '/dean/subjects',
          icon: 'eye',
        },
        {
          title: 'Add Subject',
          href: '/dean/subjects/add',
          icon: 'add',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Rooms',
      i: [
        {
          title: 'Rooms Management',
          href: '/dean/rooms',
          icon: 'eye',
        },
        // {
        //   title: 'Add Room',
        //   href: '/admin/college/rooms/add',
        //   icon: 'add',
        // },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Print Report',
      href: '/dean/print',
      icon: 'download',
    },
    {
      title: 'School & Policies',
      href: '/school/policies',
      icon: 'school',
    },
    {
      title: 'Documentation',
      href: '/',
      icon: 'page',
    },
    // {
    //   title: 'Settings',
    //   href: '/dashboard/settings',
    //   icon: 'settings',
    // },
  ],
  mainNavAdmin: [
    {
      title: 'Home',
      href: '/admin',
      icon: 'home',
    },
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: 'layoutDashboard',
    },
    {
      title: 'School & Policies',
      href: '/school',
      icon: 'school',
    },
    {
      title: 'Documentation',
      href: '',
      icon: 'page',
    },
  ],
  sidebarAdmin: [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: 'layoutDashboard',
    },
    // {
    //   title: 'Secondary Education',
    //   i: [
    //     {
    //       title: 'Junior High School',
    //       i: [
    //         {
    //           title: 'Sections',
    //           i: [
    //             {
    //               title: 'Section Management',
    //               href: '/admin/courses/blocks',
    //               icon: 'eye',
    //             },
    //             {
    //               title: 'Add Section',
    //               href: '/admin/courses/blocks/add',
    //               icon: 'add',
    //             },
    //           ],
    //           icon: 'packageSearch',
    //         },
    //         {
    //           title: 'Level Management',
    //           href: '/admin/courses/blocks',
    //           icon: 'eye',
    //         },
    //         {
    //           title: 'Add Level',
    //           href: '/admin/courses/blocks/add',
    //           icon: 'add',
    //         },
    //       ],
    //       icon: 'bookOpenText',
    //     },
    //     {
    //       title: 'Senior High School',
    //       i: [
    //         {
    //           title: 'Sections',
    //           i: [
    //             {
    //               title: 'Section Management',
    //               href: '/admin/courses/blocks',
    //               icon: 'eye',
    //             },
    //             {
    //               title: 'Add Section',
    //               href: '/admin/courses/blocks/add',
    //               icon: 'add',
    //             },
    //           ],
    //           icon: 'packageSearch',
    //         },
    //         {
    //           title: 'Strand/Tracks Management',
    //           href: '/admin/courses/blocks',
    //           icon: 'eye',
    //         },
    //         {
    //           title: 'Add Strand/Tracks',
    //           href: '/admin/courses/blocks/add',
    //           icon: 'add',
    //         },
    //       ],
    //       icon: 'bookOpenText',
    //     },
    //   ],
    //   icon: 'packageSearch',
    // },
    // {
    //   title: 'Vocational Education',
    //   i: [
    //     {
    //       title: 'Tesda',
    //       i: [
    //         {
    //           title: 'Blocks',
    //           i: [
    //             {
    //               title: 'Block Management',
    //               href: '/admin/courses/blocks',
    //               icon: 'eye',
    //             },
    //             {
    //               title: 'Add Block',
    //               href: '/admin/courses/blocks/add',
    //               icon: 'add',
    //             },
    //           ],
    //           icon: 'packageSearch',
    //         },
    //         {
    //           title: 'Course Management',
    //           href: '/admin/courses/blocks',
    //           icon: 'eye',
    //         },
    //         {
    //           title: 'Add Course',
    //           href: '/admin/courses/blocks/add',
    //           icon: 'add',
    //         },
    //       ],
    //       icon: 'bookOpenText',
    //     },
    //   ],
    //   icon: 'packageSearch',
    // },
    // {
    //   title: 'Tertiary Education',
    //   i: [
    //     {
    //       title: 'College',
    //       i: [
    //         {
    //           title: 'Blocks',
    //           i: [
    //             {
    //               title: 'Blocks Management',
    //               href: '/admin/college/blocks',
    //               icon: 'eye',
    //             },
    //             {
    //               title: 'Add Block',
    //               href: '/admin/college/blocks/add',
    //               icon: 'add',
    //             },
    //           ],
    //           icon: 'packageSearch',
    //         },
    //         {
    //           title: 'Courses',
    //           i: [
    //             {
    //               title: 'Courses Management',
    //               href: '/admin/college/courses',
    //               icon: 'eye',
    //             },
    //             {
    //               title: 'Add Course',
    //               href: '/admin/college/courses/add',
    //               icon: 'add',
    //             },
    //           ],
    //           icon: 'packageSearch',
    //         },
    //         {
    //           title: 'Curriculums',
    //           i: [
    //             {
    //               title: 'Curriculum Management',
    //               href: '/admin/college/curriculums',
    //               icon: 'eye',
    //             },
    //             {
    //               title: 'Student Curriculum Mng.',
    //               href: '/admin/college/curriculums/students',
    //               icon: 'eye',
    //             },
    //           ],
    //           icon: 'packageSearch',
    //         },
    //         {
    //           title: 'Enrollment',
    //           i: [
    //             {
    //               title: 'Enrollment Process',
    //               i: [
    //                 {
    //                   title: 'Step 1 Management',
    //                   href: '/admin/college/enrollment/management?step=1',
    //                   icon: 'eye',
    //                 },
    //                 {
    //                   title: 'Step 2 Management',
    //                   href: '/admin/college/enrollment/management?step=2',
    //                   icon: 'eye',
    //                 },
    //                 {
    //                   title: 'Step 3 Management',
    //                   href: '/admin/college/enrollment/management?step=3',
    //                   icon: 'eye',
    //                 },
    //                 {
    //                   title: 'Step 4 Management',
    //                   href: '/admin/college/enrollment/management?step=4',
    //                   icon: 'eye',
    //                 },
    //                 {
    //                   title: 'Step 5 Management',
    //                   href: '/admin/college/enrollment/management?step=5',
    //                   icon: 'eye',
    //                 },
    //                 {
    //                   title: 'Step 6 Management',
    //                   href: '/admin/college/enrollment/management?step=6',
    //                   icon: 'eye',
    //                 },
    //               ],
    //               icon: 'packageSearch',
    //             },
    //             {
    //               title: 'Enrolled Students',
    //               i: [
    //                 {
    //                   title: 'View Enrolled Students',
    //                   href: '/admin/college/enrollment/enrolled',
    //                   icon: 'eye',
    //                 },
    //               ],
    //               icon: 'packageSearch',
    //             },
    //             {
    //               title: 'Temporary',
    //               i: [
    //                 {
    //                   title: 'View Temporary Enrolled',
    //                   href: '/admin/college/enrollment/temporary',
    //                   icon: 'eye',
    //                 },
    //               ],
    //               icon: 'packageSearch',
    //             },
    //             {
    //               title: 'Reported Grades',
    //               i: [
    //                 {
    //                   title: 'All Grades Report',
    //                   href: '/admin/college/enrollment/report/grade',
    //                   icon: 'eye',
    //                 },
    //               ],
    //               icon: 'packageSearch',
    //             },
    //             {
    //               title: 'Recent Records',
    //               i: [
    //                 {
    //                   title: 'Enrollment Records',
    //                   href: '/admin/college/enrollment/record/enrollment',
    //                   icon: 'eye',
    //                 },
    //                 {
    //                   title: 'Instructor Sched. Records',
    //                   href: '/admin/college/enrollment/record/schedule',
    //                   icon: 'eye',
    //                 },
    //               ],
    //               icon: 'packageSearch',
    //             },
    //           ],
    //           icon: 'packageSearch',
    //         },
    //         {
    //           title: 'Instructors',
    //           i: [
    //             {
    //               title: 'Instructors Management',
    //               href: '/admin/college/schedules/instructors',
    //               icon: 'eye',
    //             },
    //             {
    //               title: 'Add Instructor Schedule',
    //               href: '/admin/college/schedules/instructors/add',
    //               icon: 'add',
    //             },
    //           ],
    //           icon: 'packageSearch',
    //         },
    //         {
    //           title: 'Subjects',
    //           i: [
    //             {
    //               title: 'Subjects Management',
    //               href: '/admin/college/subjects',
    //               icon: 'eye',
    //             },
    //             {
    //               title: 'Add Subject',
    //               href: '/admin/college/subjects/add',
    //               icon: 'add',
    //             },
    //           ],
    //           icon: 'packageSearch',
    //         },
    //         {
    //           title: 'Rooms',
    //           i: [
    //             {
    //               title: 'Rooms Management',
    //               href: '/admin/college/rooms',
    //               icon: 'eye',
    //             },
    //             {
    //               title: 'Add Room',
    //               href: '/admin/college/rooms/add',
    //               icon: 'add',
    //             },
    //           ],
    //           icon: 'packageSearch',
    //         },
    //       ],
    //       icon: 'bookOpenText',
    //     },
    //   ],
    //   icon: 'packageSearch',
    // },
    {
      title: 'Blocks',
      i: [
        {
          title: 'Blocks Management',
          href: '/admin/college/blocks',
          icon: 'eye',
        },
        // {
        //   title: 'Add Block',
        //   href: '/admin/college/blocks/add',
        //   icon: 'add',
        // },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Courses',
      i: [
        {
          title: 'Courses Management',
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
      title: 'Curriculums',
      i: [
        {
          title: 'Curriculum Management',
          href: '/admin/college/curriculums',
          icon: 'eye',
        },
        {
          title: 'Student Curriculum Mng.',
          href: '/admin/college/curriculums/students',
          icon: 'eye',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Enrollment',
      i: [
        {
          title: 'Enrollment Process',
          i: [
            {
              title: 'Step 1 Verify Enrollee Information',
              href: '/admin/college/enrollment/management?step=1',
              icon: 'eye',
            },
            {
              title: 'Step 2 Evaluate the Student',
              href: '/admin/college/enrollment/management?step=2',
              icon: 'eye',
            },
            {
              title: 'Step 3 Add Subjects of Enrollee',
              href: '/admin/college/enrollment/management?step=3',
              icon: 'eye',
            },
            {
              title: 'Step 4 Approval of Add/Drop Subject Request',
              href: '/admin/college/enrollment/management?step=4',
              icon: 'eye',
            },
            {
              title: 'Step 5 Student Payment',
              href: '/admin/college/enrollment/management?step=5',
              icon: 'eye',
            },
            {
              title: 'Step 6 Finalizing Student Enrollment',
              href: '/admin/college/enrollment/management?step=6',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Request Add/Drop/Withdraw',
          i: [
            {
              title: 'View Request Add',
              href: 'admin/college/enrollment/management?step=1',
              icon: 'eye',
            },
            {
              title: 'View Request Drop',
              href: 'admin/college/enrollment/management?step=2',
              icon: 'eye',
            },
            {
              title: 'View Request Withdraw',
              href: 'admin/college/enrollment/request/withdraw',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Enrolled Students',
          i: [
            {
              title: 'View Enrolled Students',
              href: '/admin/college/enrollment/enrolled',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Temporary',
          i: [
            {
              title: 'View Temporary Enrolled',
              href: '/admin/college/enrollment/temporary',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Recent Records',
          i: [
            {
              title: 'Enrollment Records',
              href: '/admin/college/enrollment/record/enrollment',
              icon: 'eye',
            },
            {
              title: 'Instructor Sched. Records',
              href: '/admin/college/enrollment/record/schedule',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Instructors',
      i: [
        {
          title: 'Instructors Management',
          href: '/admin/college/schedules/instructors',
          icon: 'eye',
        },
        // {
        //   title: 'Add Instructor Schedule',
        //   href: '/admin/college/schedules/instructors/add',
        //   icon: 'add',
        // },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Reported Grades',
      i: [
        {
          title: 'Class Grades Report',
          href: '/admin/college/enrollment/report/grade',
          icon: 'eye',
        },
        {
          title: 'Individual Grades Report',
          href: '/admin/college/enrollment/report/grade/individual',
          icon: 'eye',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Subjects',
      i: [
        {
          title: 'Subjects Management',
          href: '/admin/college/subjects',
          icon: 'eye',
        },
        // {
        //   title: 'Add Subject',
        //   href: '/admin/college/subjects/add',
        //   icon: 'add',
        // },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Rooms',
      i: [
        {
          title: 'Rooms Management',
          href: '/admin/college/rooms',
          icon: 'eye',
        },
        {
          title: 'Add Room',
          href: '/admin/college/rooms/add',
          icon: 'add',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Print Report',
      href: '/admin/college/print',
      icon: 'download',
    },
    {
      title: 'Accounts',
      i: [
        {
          title: 'Role Admins',
          i: [
            {
              title: 'Admins Management',
              href: '/admin/users/admins',
              icon: 'eye',
            },
            {
              title: 'Add Admin',
              href: '/admin/users/admins/add',
              icon: 'add',
            },
          ],
          icon: 'userSearch',
        },
        {
          title: 'Role Deans',
          i: [
            {
              title: 'Deans Management',
              href: '/admin/users/deans',
              icon: 'eye',
            },
            {
              title: 'Add Dean',
              href: '/admin/users/deans/add',
              icon: 'add',
            },
          ],
          icon: 'userSearch',
        },
        {
          title: 'Role Instructor',
          i: [
            {
              title: 'Instructors Management',
              href: '/admin/users/instructors',
              icon: 'eye',
            },
            {
              title: 'Add Instructor',
              href: '/admin/users/instructors/add',
              icon: 'add',
            },
          ],
          icon: 'userSearch',
        },
        {
          title: 'Role Accounting',
          i: [
            {
              title: 'Accountings Management',
              href: '/admin/users/accountings',
              icon: 'eye',
            },
            {
              title: 'Add Accounting',
              href: '/admin/users/accountings/add',
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
    // {
    //   title: 'Records',
    //   href: '/',
    //   icon: 'fileStack',
    // },
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
  ],
  mainNavSuperAdmin: [
    {
      title: 'Home',
      href: '/superadmin',
      icon: 'home',
    },
    {
      title: 'Dashboard',
      href: '/superadmin/dashboard',
      icon: 'layoutDashboard',
    },
    {
      title: 'School & Policies',
      href: '/school',
      icon: 'school',
    },
    {
      title: 'Documentation',
      href: '',
      icon: 'page',
    },
  ],
  sidebarSuperAdmin: [
    // {
    //   title: 'Dashboard',
    //   href: '/admin/dashboard',
    //   icon: 'layoutDashboard',
    // },
    {
      title: 'Blocks',
      i: [
        {
          title: 'Blocks Management',
          href: '/superadmin/college/blocks',
          icon: 'eye',
        },
        {
          title: 'Archive Blocks Management',
          href: '/superadmin/college/blocks/archive',
          icon: 'eye',
        },
        // {
        //   title: 'Add Block',
        //   href: '/admin/college/blocks/add',
        //   icon: 'add',
        // },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Courses',
      i: [
        {
          title: 'Courses Management',
          href: '/superadmin/college/courses',
          icon: 'eye',
        },
        {
          title: 'Archive Courses Management',
          href: '/superadmin/college/courses/archive',
          icon: 'eye',
        },
        // {
        //   title: 'Add Course',
        //   href: '/admin/college/courses/add',
        //   icon: 'add',
        // },
      ],
      icon: 'packageSearch',
    },
    // {
    //   title: 'Curriculums',
    //   i: [
    //     {
    //       title: 'Curriculum Management',
    //       href: '/admin/college/curriculums',
    //       icon: 'eye',
    //     },
    //     {
    //       title: 'Student Curriculum Mng.',
    //       href: '/admin/college/curriculums/students',
    //       icon: 'eye',
    //     },
    //   ],
    //   icon: 'packageSearch',
    // },
    {
      title: 'Enrollment',
      i: [
        // {
        //   title: 'Enrollment Process',
        //   i: [
        //     {
        //       title: 'Step 1 Verify Enrollee Information',
        //       href: '/superadmin/college/enrollment/management?step=1',
        //       icon: 'eye',
        //     },
        //     {
        //       title: 'Step 2 Evaluate the Student',
        //       href: '/superadmin/college/enrollment/management?step=2',
        //       icon: 'eye',
        //     },
        //     {
        //       title: 'Step 3 Add Subjects of Enrollee',
        //       href: '/superadmin/college/enrollment/management?step=3',
        //       icon: 'eye',
        //     },
        //     {
        //       title: 'Step 4 Approval of Add/Drop Subject Request',
        //       href: '/superadmin/college/enrollment/management?step=4',
        //       icon: 'eye',
        //     },
        //     {
        //       title: 'Step 5 Student Payment',
        //       href: '/superadmin/college/enrollment/management?step=5',
        //       icon: 'eye',
        //     },
        //     {
        //       title: 'Step 6 Finalizing Student Enrollment',
        //       href: '/superadmin/college/enrollment/management?step=6',
        //       icon: 'eye',
        //     },
        //   ],
        //   icon: 'packageSearch',
        // },
        {
          title: 'Rejected Students',
          i: [
            {
              title: 'View Rejected Students',
              href: '/superadmin/college/enrollment/rejected',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Enrolling Students',
          i: [
            {
              title: 'View Rejected Students',
              href: '/superadmin/college/enrollment/enrolling',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Enrolled Students',
          i: [
            {
              title: 'View Enrolled Students',
              href: '/superadmin/college/enrollment/enrolled',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Temporary',
          i: [
            {
              title: 'View Temporary Enrolled',
              href: '/superadmin/college/enrollment/temporary',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
        {
          title: 'Recent Records',
          i: [
            {
              title: 'Enrollment Records',
              href: '/superadmin/college/enrollment/record/enrollment',
              icon: 'eye',
            },
            {
              title: 'Instructor Sched. Records',
              href: '/superadmin/college/enrollment/record/schedule',
              icon: 'eye',
            },
          ],
          icon: 'packageSearch',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Instructors Schedule',
      i: [
        {
          title: 'Instructors Schedule Management',
          href: '/superadmin/college/schedules/all',
          icon: 'eye',
        },
        {
          title: 'Archive Instructors Schedule Management',
          href: '/superadmin/college/schedules/instructors/archive',
          icon: 'eye',
        },
        // {
        //   title: 'Add Instructor Schedule',
        //   href: '/admin/college/schedules/instructors/add',
        //   icon: 'add',
        // },
      ],
      icon: 'packageSearch',
    },
    // {
    //   title: 'Reported Grades',
    //   i: [
    //     {
    //       title: 'Class Grades Report',
    //       href: '/superadmin/college/enrollment/report/grade',
    //       icon: 'eye',
    //     },
    //     {
    //       title: 'Individual Grades Report',
    //       href: '/superadmin/college/enrollment/report/grade/individual',
    //       icon: 'eye',
    //     },
    //   ],
    //   icon: 'packageSearch',
    // },
    {
      title: 'Subjects',
      i: [
        {
          title: 'Subjects Management',
          href: '/superadmin/college/subjects',
          icon: 'eye',
        },
        {
          title: 'Archive Subjects Management',
          href: '/superadmin/college/subjects/archive',
          icon: 'eye',
        },
        // {
        //   title: 'Add Subject',
        //   href: '/superadmin/college/subjects/add',
        //   icon: 'add',
        // },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Rooms',
      i: [
        {
          title: 'Rooms Management',
          href: '/superadmin/college/rooms',
          icon: 'eye',
        },
        {
          title: 'Archive Rooms Management',
          href: '/superadmin/college/rooms/archive',
          icon: 'eye',
        },
        // {
        //   title: 'Add Room',
        //   href: '/superadmin/college/rooms/add',
        //   icon: 'add',
        // },
      ],
      icon: 'packageSearch',
    },
    // {
    //   title: 'Print Report',
    //   href: '/superadmin/college/print',
    //   icon: 'download',
    // },
    {
      title: 'Accounts',
      i: [
        {
          title: 'Role Super Admins',
          i: [
            {
              title: 'Super Admins Management',
              href: '/superadmin/users/superadmin',
              icon: 'eye',
            },
            {
              title: 'Add Super Admin',
              href: '/superadmin/users/superadmin/add',
              icon: 'add',
            },
          ],
          icon: 'userSearch',
        },
        {
          title: 'Role Admins',
          i: [
            {
              title: 'Admins Management',
              href: '/superadmin/users/admins',
              icon: 'eye',
            },
            {
              title: 'Add Admin',
              href: '/superadmin/users/admins/add',
              icon: 'add',
            },
          ],
          icon: 'userSearch',
        },
        {
          title: 'Role Deans',
          i: [
            {
              title: 'Deans Management',
              href: '/superadmin/users/deans',
              icon: 'eye',
            },
            {
              title: 'Add Dean',
              href: '/superadmin/users/deans/add',
              icon: 'add',
            },
          ],
          icon: 'userSearch',
        },
        {
          title: 'Role Instructor',
          i: [
            {
              title: 'Instructors Management',
              href: '/superadmin/users/instructors',
              icon: 'eye',
            },
            {
              title: 'Add Instructor',
              href: '/superadmin/users/instructors/add',
              icon: 'add',
            },
          ],
          icon: 'userSearch',
        },
        {
          title: 'Role Accounting',
          i: [
            {
              title: 'Accountings Management',
              href: '/superadmin/users/accountings',
              icon: 'eye',
            },
            {
              title: 'Add Accounting',
              href: '/superadmin/users/accountings/add',
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
              href: '/superadmin/users/students',
              icon: 'eye',
            },
            {
              title: 'Add Student',
              href: '/superadmin/users/students/add',
              icon: 'add',
            },
          ],
          icon: 'userSearch',
        },
      ],
      icon: 'usersRound',
    },
    // {
    //   title: 'Records',
    //   href: '/',
    //   icon: 'fileStack',
    // },
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
  ],
  sidebarAccounting: [
    {
      title: 'Courses Fees',
      i: [
        {
          title: `View Courses Fees`,
          href: '/accounting/college/tuition',
          icon: 'eye',
        },
        {
          title: 'Create Course Fee',
          href: '/accounting/college/tuition/add',
          icon: 'add',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Enrolling Students',
      i: [
        {
          title: 'View Enrolling Students',
          href: '/accounting/college/enrolling',
          icon: 'eye',
        },
      ],
      icon: 'packageSearch',
    },

    {
      title: 'Enrolled Students',
      i: [
        {
          title: 'View Enrolled Students',
          href: '/accounting/college/enrolled',
          icon: 'eye',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Temporary Enrolled',
      i: [
        {
          title: 'View Temporary Enrolled',
          href: '/accounting/college/temporary',
          icon: 'eye',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Students Balance',
      i: [
        {
          title: 'View Students Balances',
          href: '/accounting/college/balance',
          icon: 'eye',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Students Balance Record',
      i: [
        {
          title: 'View Students Balances Record',
          href: '/accounting/college/record',
          icon: 'eye',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Students Receipts',
      i: [
        {
          title: 'View Students Receipts',
          href: '/accounting/college/receipts',
          icon: 'eye',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Students Scholarships',
      i: [
        {
          title: `View Student's Scholarships`,
          href: '/accounting/college/scholarships',
          icon: 'eye',
        },
        {
          title: 'Add Student Scholarships',
          href: '/accounting/college/scholarships/add',
          icon: 'add',
        },
      ],
      icon: 'packageSearch',
    },
    {
      title: 'School & Policies',
      href: '/school/policies',
      icon: 'school',
    },
    {
      title: 'Documentation',
      href: '/documentation',
      icon: 'page',
    },
  ],
  mainNavAccounting: [
    {
      title: 'Home',
      href: '/accounting',
      icon: 'home',
    },
    {
      title: 'School & Policies',
      href: '/school/policy',
      icon: 'school',
    },
    {
      title: 'Documentation',
      href: '',
      icon: 'page',
    },
  ],
};
