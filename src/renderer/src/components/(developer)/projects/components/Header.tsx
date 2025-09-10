import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between items-center'>
        <div className='flex flex-col space-y-2'>
            <h1 className='text-3xl text-[#5F6ED1] font-bold' >My Projects</h1>
            <p className='text-sm text-[#838A94]'>Track your assigned projects and manage work sessions</p>
        </div>
        <div className='flex justify-between gap-14 items-center bg-[#5F6ED1] py-3 px-4 rounded-[15px]   '>
            <div className='flex items-center gap-3 '>
                <div className='w-5 h-5 bg-[#00FF00] rounded-full'></div>
                <div className='flex flex-col '>
                    <p className='font-semibold text-white' >Currently Tracking</p>
                    <p className='text-sm font-medium text-white'>E-commerce Dashboard Redesign</p>
                </div>
            </div>
            <div className='flex flex-col items-end'>
                <p className='font-semibold text-white' >2:05</p>
                <p className='text-xs font-semibold text-white '>Session Time</p>
            </div>
            
        </div>
    </div>
  )
}

export default Header