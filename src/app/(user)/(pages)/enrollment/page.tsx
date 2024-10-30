'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import LoaderPage from '@/components/shared/LoaderPage';
import { Icons } from '@/components/shared/Icons';
import { useEnrollmentQueryBySessionId } from '@/lib/queries/enrollment/get/session';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: s } = useSession();
  const router = useRouter();
  const { data: resE, isLoading: ELoading, error: eError } = useEnrollmentQueryBySessionId(s?.user.id!);
  useEffect(() => {
    if (eError || !resE) return;
    if (resE) {
      if (resE.enrollment) {
        router.push(`/enrollment/${resE.enrollment.category.toLowerCase()}`);
        return;
      } else {
        setIsPageLoading(false);
        return;
      }
    }
  }, [resE, eError, router]);
  
  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <LoaderPage />
        </div>
      ) : (
        <div className='w-full rounded-md flex flex-col filter-none items-center px-6 py-8 justify-center'>
          <div className='w-full flex justify-center items-center '>
            <div className='flex gap-x-2 xs:flex-row flex-col'>
              <div className='w-full sm:w-auto flex justify-center'>
                <Image src='/images/logo1.png' alt='nothing to say' width={100} height={100} className='h-36 w-36' priority />
              </div>
              <div className='flex flex-col sm:mt-10'>
                <div className='uppercase font-semibold sm:text-xl xs:text-lg text-sm'>Dipolog City Institute of Technology, INC.</div>
                <div className='uppercase font-semibold sm:text-xl xs:text-lg text-sm'>National Highway, Minaog, Dipolog City, Zamboanga del Norte</div>
              </div>
            </div>
            {/* <Icons.hourglass className='md:h-14 fill-gray-100 md:w-14 h-10 w-10 my-3 stroke-green-400 animate-spin' style={{ animationDuration: '6s' }} /> */}
          </div>
          <div className='flex w-full flex-col mt-10'>
            <h1 className='font-semibold tracking-tight text-3xl lg:text-left text-center w-full'>Available Categories</h1>
          </div>
          {/* <div className='grid lg:grid-cols-2 shadow-none drop-shadow-none xl:grid-cols-3 gap-y-8 sm:grid-cols-2 grid-cols-1 gap-4 my-5 w-full place-items-center bg-transparent'> */}
          <div className='grid gap-y-8 sm:grid-cols-1 grid-cols-1 gap-4 my-5 w-full place-items-center bg-transparent'>
            <Card className='w-full group shadow-sm drop-shadow-sm bg-white'>
              <CardHeader className='hidden'>
                <CardTitle className=' capitalize text-[16px]'></CardTitle>
              </CardHeader>
              <CardContent className='w-full border space-y-2 p-0 group-hover:bg-gray-300 group-hover:bg-opacity-55 group-hover:border-blue-200'>
                <div className='w-full flex sm:flex-row flex-col rounded-lg'>
                  <div className='w-full sm:w-56 p-5 '>
                    <Image src={`/images/education_bg.jpg`} className='w-full sm:w-56 border rounded-lg sm:h-48 lg:h-44' width={200} height={200} priority alt={'nothing to say'} />
                  </div>
                  <div className='flex flex-col flex-1 p-5'>
                    <div className='flex w-full justify-end items-center hover:underline'>
                      <Link href={``} className='flex gap-2 items-center text-sm'>
                        <span className='text-blue-700'>Enroll In JHS</span> <Icons.arrowRight className='h-4 w-4' />
                      </Link>
                    </div>
                    <h1 className=' text-xl tracking-tight capitalize font-semibold'>Junior High School</h1>
                    <div className='space-y-1.5 flex flex-col px-2'>
                      <p className='text-sm text-muted-foreground text-justify first-letter:uppercase'>
                        &nbsp;&nbsp;&nbsp;&nbsp;The Junior High School program at Dipolog City Institute of Technology, INC. provides a well-rounded educational foundation for students in Grades 7 to 10. This stage is a critical period where learners develop
                        essential academic skills, strengthen character, and explore their individual interests. With a strong focus on holistic development, the school prepares students for the next step in their educational journey, equipping them with the
                        knowledge and values needed for Senior High School and beyond. At DCIT, INC., students are nurtured in a supportive environment that encourages intellectual curiosity, personal growth, and social responsibility.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='mt-5 hidden'>aa</CardFooter>
            </Card>
            <Card className='w-full group shadow-sm drop-shadow-sm bg-white'>
              <CardHeader className='hidden'>
                <CardTitle className=' capitalize text-[16px]'></CardTitle>
              </CardHeader>
              <CardContent className='w-full border space-y-2 p-0 group-hover:bg-gray-300 group-hover:bg-opacity-55 group-hover:border-blue-200'>
                <div className='w-full flex sm:flex-row flex-col rounded-lg'>
                  <div className='w-full sm:w-56 p-5 '>
                    <Image src={`/images/education_bg.jpg`} className='w-full sm:w-56 border rounded-lg sm:h-48 lg:h-44' width={200} height={200} priority alt={'nothing to say'} />
                  </div>
                  <div className='flex flex-col flex-1 p-5'>
                    <div className='flex w-full justify-end items-center hover:underline'>
                      <Link href={``} className='flex gap-2 items-center text-sm'>
                        <span className='text-blue-700'>Enroll In SHS</span> <Icons.arrowRight className='h-4 w-4' />
                      </Link>
                    </div>
                    <h1 className=' text-xl tracking-tight capitalize font-semibold'>Senior High School</h1>
                    <div className='space-y-1.5 flex flex-col px-2'>
                      <p className='text-sm text-muted-foreground text-justify first-letter:uppercase'>
                        &nbsp;&nbsp;&nbsp;&nbsp;The Senior High School program at Dipolog City Institute of Technology, INC. offers students in Grades 11 and 12 an opportunity to deepen their academic knowledge and practical skills while preparing them for
                        their future endeavors. With a curriculum that includes various tracks—Academic, Technical-Vocational-Livelihood (TVL), and Sports—students can choose paths that align with their interests and career aspirations. The program emphasizes
                        critical thinking, problem-solving, and real-world applications, ensuring that graduates are well-equipped for higher education, employment, or entrepreneurship. At DCIT, INC., we foster an environment of innovation, collaboration, and
                        excellence, empowering students to achieve their goals and contribute positively to society.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='mt-5 hidden'>aa</CardFooter>
            </Card>
            <Card className='w-full group shadow-sm drop-shadow-sm bg-white'>
              <CardHeader className='hidden'>
                <CardTitle className=' capitalize text-[16px]'></CardTitle>
              </CardHeader>
              <CardContent className='w-full border space-y-2 p-0 group-hover:bg-gray-300 group-hover:bg-opacity-55 group-hover:border-blue-200'>
                <div className='w-full flex sm:flex-row flex-col rounded-lg'>
                  <div className='w-full sm:w-56 p-5 '>
                    <Image src={`/images/education_bg.jpg`} className='w-full sm:w-56 border rounded-lg sm:h-48 lg:h-44' width={200} height={200} priority alt={'nothing to say'} />
                  </div>
                  <div className='flex flex-col flex-1 p-5'>
                    <div className='flex w-full justify-end items-center hover:underline'>
                      <Link href={``} className='flex gap-2 items-center text-sm'>
                        <span className='text-blue-700'>Enroll In Tesda</span> <Icons.arrowRight className='h-4 w-4' />
                      </Link>
                    </div>
                    <h1 className=' text-xl tracking-tight capitalize font-semibold'>Technical Education and Skills Development Authority (TESDA)</h1>
                    <div className='space-y-1.5 flex flex-col px-2'>
                      <p className='text-sm text-muted-foreground text-justify first-letter:uppercase'>
                        &nbsp;&nbsp;&nbsp;&nbsp;The Vocational Program at Dipolog City Institute of Technology, INC., in partnership with the Technical Education and Skills Development Authority (TESDA), provides hands-on training and education for students
                        seeking to develop specific technical skills and competencies. This program caters to individuals who aspire to enter the workforce with practical expertise in various fields, including automotive technology, electronics, culinary arts,
                        and more. Our curriculum is designed to meet industry standards, ensuring that students are equipped with the knowledge and skills necessary for employment or entrepreneurship. With experienced instructors and modern facilities, DCIT,
                        INC. fosters a supportive learning environment that empowers students to achieve their career goals and succeed in their chosen vocations.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='mt-5 hidden'>aa</CardFooter>
            </Card>
            <Card className='w-full group shadow-sm drop-shadow-sm bg-white'>
              <CardHeader className='hidden'>
                <CardTitle className=' capitalize text-[16px]'></CardTitle>
              </CardHeader>
              <CardContent className='w-full border space-y-2 p-0 group-hover:bg-gray-300 group-hover:bg-opacity-55 group-hover:border-blue-200'>
                <div className='w-full flex sm:flex-row flex-col rounded-lg'>
                  <div className='w-full sm:w-56 p-5 '>
                    <Image src={`/images/education_bg.jpg`} className='w-full sm:w-56 border rounded-lg sm:h-48 lg:h-44' width={200} height={200} priority alt={'nothing to say'} />
                  </div>
                  <div className='flex flex-col flex-1 p-5'>
                    <div className='flex w-full justify-end items-center hover:underline'>
                      <Link href={`/enrollment/college`} className='flex gap-2 items-center text-sm'>
                        <span className='text-blue-700'>Enroll In College</span> <Icons.arrowRight className='h-4 w-4' />
                      </Link>
                    </div>
                    <h1 className=' text-xl tracking-tight capitalize font-semibold'>College</h1>
                    <div className='space-y-1.5 flex flex-col px-2'>
                      <p className='text-sm text-muted-foreground text-justify first-letter:uppercase'>
                        &nbsp;&nbsp;&nbsp;&nbsp;The College Program at Dipolog City Institute of Technology, INC. offers a comprehensive higher education experience designed to equip students with the knowledge, skills, and competencies needed to thrive in
                        their chosen fields. With a diverse array of degree programs in areas such as engineering, information technology, business administration, and hospitality management, students receive a well-rounded education that emphasizes both
                        academic excellence and practical application. Our dedicated faculty, modern facilities, and innovative teaching methods foster a dynamic learning environment where students are encouraged to engage, collaborate, and develop critical
                        thinking skills. At DCIT, INC., we prepare graduates not only for successful careers but also for lifelong learning and responsible citizenship in an ever-changing global landscape.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='mt-5 hidden'>aa</CardFooter>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default Page;
