import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from '@/components/shared/Icons';

export const metadata = {
  title: 'About Us',
  description:
    'Learn about Dipolog City Institute of Technology’s trusted Enrollment Management System — empowering students and staff to manage academic journeys efficiently.',
};

const Page = () => {
  return (
    <div className="flex flex-col items-center w-full px-4 py-8">
      {/* Header Section */}
      <Image
        src="/images/logo1.png"
        alt="background-logo"
        fill
        className="absolute mt-10 top-[0px] sm:top-[-20px] md:top-[-40px] opacity-10 object-contain pointer-events-none z-0"
      />
      <div className="flex flex-col items-center text-center space-y-2 text-[14px] sm:text-[16px]">
        <Image src="/images/logo1.png" alt="logo" width={120} height={120} priority />
        <p>Republic of the Philippines</p>
        <p className="text-lg sm:text-xl font-bold uppercase">
          Dipolog City Institute of Technology, INC.
        </p>
        <p>National Highway, Minaog, Dipolog City</p>
        <p>Contact No. 09103486221 / 212-2979</p>
        <p>
          Email Address: <span className="text-blue-500 underline">dcitRegistrar22@gmail.com</span>
        </p>
        <p>FB Account: Dcit Registrar</p>
      </div>

      {/* About Us Section */}
      <div className="w-full max-w-6xl">
        <div className="w-full flex justify-start sm:justify-end">
          <Link href="/" className="text-blue-500 hover:underline gap-1 sm:gap-2 flex items-center">
            <Icons.arrowLeft className="h-4 w-4" />
            Go back to the homepage
          </Link>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-4">About Us</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-4">
          The Dipolog City Institute of Technology (DCIT) was established on September 11, 1986 and
          started its operations in school year 1987-88 in Dipolog City, Zamboanga del Norte. It is
          registered as a non-stock corporation under SEC Registration No. DS-00929 issued on July
          6, 1987 in compliance with the Education Act of 1982 (Batas Pambansa Blg. 232).
        </p>
        <p className="text-sm sm:text-base text-muted-foreground mb-4">
          From humble beginnings, DCIT offered Two-Year Voc-Tech courses and grew through stages of
          expansion, eventually purchasing land in Minaog and constructing its own buildings. The
          school now offers Technical High School, degree programs, and TESDA-accredited short-term
          courses.
        </p>
        <p className="text-sm sm:text-base text-muted-foreground">
          DCIT is ISO-accredited, certified by both AJA and UKAS. It is also recognized by CHED and
          TESDA, bearing a mark of excellence and continues to serve the growing student population
          in Dipolog City and beyond.
        </p>
      </div>

      {/* Table Section */}
      <div className="w-full max-w-6xl overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-bold my-4">Significant Historical Milestones</h2>
        <table className="w-full text-left border border-gray-300 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Year</th>
              <th className="border px-4 py-2">Milestone</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">1986</td>
              <td className="border px-4 py-2">DCIT was founded on September 11, 1986</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">1987</td>
              <td className="border px-4 py-2">
                SEC Registration as non-stock corporation (DS-00929)
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">1987-88</td>
              <td className="border px-4 py-2">Started operations for school year 1987–88</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">1988</td>
              <td className="border px-4 py-2">Acquired land in Minaog and began construction</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">1994</td>
              <td className="border px-4 py-2">
                Building completed and inaugurated by Mayor Roseller Barinaga
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">1994-95</td>
              <td className="border px-4 py-2">
                Expanded to degree programs and built 3-story building with labs and library
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">1997-98</td>
              <td className="border px-4 py-2">Started secondary program with seven students</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mission and Vision */}
      <div className="w-full max-w-6xl mt-10 space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Our Vision</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            A leading educational institution in the whole Zamboanga Peninsula (Western Mindanao)
            producing globally competitive graduates imbued with strong values of nationalism deep
            concern for the environment and genuine love of GOD and fellowmen.
          </p>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Our Mission</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Like all educational institution operating in the Philippines, the Dipolog City
            Institute of Technology seeks to develop the whole person geared towards those ideals
            and values enunciated by our national leadership.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="w-full max-w-6xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Core Values</h2>
        <ul className="list-disc list-inside text-sm sm:text-base text-muted-foreground space-y-2">
          <li>
            <span className="font-semibold">Integrity:</span> We uphold honesty, fairness, and
            ethics in all our dealings.
          </li>
          <li>
            <span className="font-semibold">Excellence:</span> We strive for the highest quality in
            teaching and service.
          </li>
          <li>
            <span className="font-semibold">Discipline:</span> We promote responsibility and strong
            work ethics among our students and staff.
          </li>
          <li>
            <span className="font-semibold">Innovation:</span> We encourage creative thinking and
            adaptability to change.
          </li>
          <li>
            <span className="font-semibold">Community:</span> We serve the local community and build
            strong social responsibility.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Page;
