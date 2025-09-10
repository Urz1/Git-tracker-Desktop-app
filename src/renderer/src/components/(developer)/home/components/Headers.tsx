'use client'
import React, { useState } from 'react'

const Headers = () => {
  const [start,setStart]=useState(true)
  return (
    <div style={{marginBottom:40}} className='bg-gradient-to-r from-[#5F6ED1] to-[#7F8FFF] rounded-3xl p-6 lg:p-8 shadow-lg pb-8'>
      <div style={{marginBottom:16}} className="flex flex-col lg:flex-row lg:justify-between gap-6">
        <div className="flex items-center gap-4 lg:gap-6">
          <img 
            src="/icons/profile.svg" 
            width={56} 
            height={56} 
            alt="profile" 
            className="rounded-full shadow-lg" 
          />
          <div>
            <h2 className="text-xl  lg:text-2xl font-bold text-white pb-2">
              Welcome back, <span className="text-yellow-300">Sarah Johnson!</span>
            </h2>
            <p className="text-white text-sm opacity-90">
              Ready to start working?<br/>Client: TechCorp Inc.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center lg:items-end">
          <span className="text-white text-2xl lg:text-3xl font-bold">6.5h</span>
          <span className="text-white text-xs opacity-90 text-center lg:text-right">
            Hours today<br/>8 commits
          </span>
        </div>
      </div>
      
      <div className='pt-6 lg:pt-8 border border-white/20 bg-white/10 w-full rounded-2xl py-4 lg:py-5 px-6 lg:px-20'>
        {start? <button onClick={() => setStart(prev => !prev)} className="flex gap-3 items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-lg transition-colors mx-auto lg:mx-0">
          <img src='/icons/start.svg' alt='start' width={20} height={18} className="w-5 h-5"/>
          Start Work
        </button> : <button onClick={() => setStart(prev => !prev)} className="flex items-center gap-5 bg-[#FF0000] text-white border-none rounded-xl py-3 px-8 font-bold text-xl cursor-pointer ml-4">
              <img src={'/icons/pause.svg'} alt='pause' width={24} height={24} className=""/> Stop Tracking
            </button>}
      </div>
    </div>
  )
}

export default Headers