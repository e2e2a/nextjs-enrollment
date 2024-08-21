import React from 'react'
import Image from 'next/image';

const PdfContent = () => {
  return (
    <div>
      <div id='pdf-content' className='w-[816px] h-[1344px]'>
        <Image alt='' src={'/pdf/123.jpg'} width={816} height={1344} priority className='absolute w-[816px] z-0 h-[1344px] top-0 left-0' />
        <div className='z-50 text-black relative'>
          <h1 className='z-50 text-black'>This content will be in the PDF</h1>
          <p>Here is some more content...</p>
        </div>
      </div>
    </div>
  )
}

export default PdfContent