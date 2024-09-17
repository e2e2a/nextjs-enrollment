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
      title: 'Schedules',
      href: '/schedules',
      icon: 'hourglass',
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
      title: 'Schedules',
      href: '/schedules',
      icon: 'hourglass',
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
      title: 'Secondary Education',
      i: [
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
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Vocational Education',
      i: [
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
      ],
      icon: 'packageSearch',
    },
    {
      title: 'Tertiary Education',
      i: [
        {
          title: 'College',
          i: [
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
              title: 'Blocks',
              i: [
                {
                  title: 'Blocks Management',
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
              title: 'Subjects',
              i: [
                {
                  title: 'Subjects Management',
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
            {
              title: 'Instructors',
              i: [
                {
                  title: 'Instructor Management',
                  href: '/admin/college/schedules/instructors',
                  icon: 'eye',
                },
                {
                  title: 'Add Instructor Schedule',
                  href: '/admin/college/schedules/instructors/add',
                  icon: 'add',
                },
              ],
              icon: 'packageSearch',
            },
            // {
            //   title: 'Schedules',
            //   i: [
            //     {
            //       title: `Instructor's Schedules`,
            //       i: [
            //         {
            //           title: 'Instructor Schedules',
            //           href: '/admin/college/schedules/instructors',
            //           icon: 'eye',
            //         },
            //         {
            //           title: 'Add Instructor Schedule',
            //           href: '/admin/college/schedules/instructors/add',
            //           icon: 'add',
            //         },
            //       ],
            //       icon: 'packageSearch',
            //     },
            //     {
            //       title: `Block's Schedules`,
            //       i: [
            //         {
            //           title: `Schedules Management`,
            //           href: '/admin/college/schedules/blocks',
            //           icon: 'eye',
            //         },
            //         {
            //           title: 'Add Block Schedule',
            //           href: '/admin/college/schedules/blocks/add',
            //           icon: 'add',
            //         },
            //       ],
            //       icon: 'packageSearch',
            //     },
            //   ],
            //   icon: 'packageSearch',
            // },
            {
              title: 'Enrollment',
              i: [
                {
                  title: 'Enrollment Process',
                  i: [
                    {
                      title: 'Step 1 Management',
                      href: '/admin/college/enrollment/management?step=1',
                      icon: 'eye',
                    },
                    {
                      title: 'Step 2 Management',
                      href: '/admin/college/enrollment/management?step=2',
                      icon: 'eye',
                    },
                    {
                      title: 'Step 3 Management',
                      href: '/admin/college/enrollment/management?step=3',
                      icon: 'eye',
                    },
                    {
                      title: 'Step 4 Management',
                      href: '/admin/college/enrollment/management?step=4',
                      icon: 'eye',
                    },
                  ],
                  icon: 'packageSearch',
                },
                {
                  title: `Student's Enrollment`,
                  i: [
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
                      title: `Student's Schedule`,
                      i: [
                        {
                          title: 'View Enrolled Students',
                          href: '/admin/college/schedules/instructors',
                          icon: 'eye',
                        },
                        
                      ],
                      icon: 'packageSearch',
                    },
                    
                  ],
                  icon: 'packageSearch',
                },
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
          ],
          icon: 'bookOpenText',
        },
      ],
      icon: 'packageSearch',
    },
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
      title: 'School Year',
      i: [
        {
          title: 'School Year Management',
          href: '/admin/schoolyear',
          icon: 'eye',
        },
      ],
      icon: 'calendarFold',
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
