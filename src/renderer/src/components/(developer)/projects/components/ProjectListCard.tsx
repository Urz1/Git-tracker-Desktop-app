
'use client';
import { Button } from '@renderer/components/ui/button';
import { CustomProgress } from '@renderer/components/ui/custom-progress';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface ProjectCard {
  title: string;
  description: string;
  status: string;
  imageUrl: string;
  progressPercent: string;
  completedDate: string;      // e.g., "1/25/2024"
  overdueDays: number;        // e.g., 578
  timeSpent: string;          // e.g., "16h"
  estimatedTime: string;      // e.g., "120"
  timeSpentToday: string;     // e.g., "6.5h"
}

interface ProjectListCardProps {
  projects: ProjectCard[];
}

const ProjectListCard: React.FC<ProjectListCardProps> = ({ projects }) => {
  const [started, setStarted] = useState<boolean[]>(projects.map(() => true));
  const navigate = useNavigate();

const toggleStart = (index: number) => {
  setStarted(prev =>
    prev.map((val, i) => (i === index ? !val : val))
  );
};
  
  return (
    <div className=" flex flex-col gap-8  font-sans">
      {projects.map((project, key) => (
        <div key={key} className='bg-white rounded-xl shadow-md p-6' >
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div className=''>
              <h2 className="flex text-black gap-9 m-0 text-[26px] font-bold">
                {project.title}
                <span className=" flex items-center text-sm font-bold bg-yellow-200 text-white rounded-2xl px-4  ">High</span>
                <span className="flex items-center gap-2 text-sm bg-[#FCCA4E] text-white rounded-2xl px-3 py-1 ">
                  <img src={'/icons/inprogress.svg'} alt='' width={16} height={13}/>
                  In Progress</span>
              </h2>
              <div className="text-[#838A94] text-base font-semibold pt-2">{project.description}</div>
              <div className="flex gap-2 items-center mt-2.5">
                <img src={project.imageUrl} alt="avatar" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white shadow-md" />
                <div className='flex flex-col space-y-0.5'>
                  <span className="text-[#404D61] text-base font-medium">Harun Jeylan</span>
                  <span className="text-[#838A94] text-sm font-medium">Golden age</span>
                </div>
              </div>
            </div>
            {started[key] ? (
  <button
    onClick={() => toggleStart(key)}
    className="flex gap-3 items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-lg transition-colors mx-auto lg:mx-0"
  >
    <img src="/icons/start.svg" alt="start" width={20} height={18} className="w-5 h-5" />
    Start Work
  </button>
) : (
  <button
    onClick={() => toggleStart(key)}
    className="flex items-center gap-5 bg-[#FF0000] text-white border-none rounded-xl py-3 px-8 font-bold text-xl cursor-pointer ml-4"
  >
    <img src={'/icons/pause.svg'} alt="pause" width={24} height={24} />
    Stop Tracking
  </button>
)}

          </div>
          <div style={{marginBottom:16}} className='flex justify-end '>
          <span className="text-2xl font-semibold text-[#5F6ED1]">{parseInt(project.progressPercent)}%</span>
          </div>
          {/* Progress Bar */}
          <CustomProgress value={parseInt(project.progressPercent)}  className="h-3 rounded-[10px]" barClassName='bg-black'  />
          {/* Info Cards */}
          <div style={{marginTop:32}} className="flex gap-6 ">
            {/* Completed Card */}
            <div className="flex flex-col w-full justify-center items-center bg-blue-100 rounded-2xl p-6 relative">
              <img src={'/icons/calendar.svg'} alt='calendar' width={33} height={33} style={{marginBottom:8}}  />
              <div className="text-indigo-500 font-semibold  mb-2">Completed</div>
              <div className="text-2xl font-bold text-gray-500 ">{project.completedDate}</div>
              <div className="text-red-600 font-bold text-base mt-2">{project.overdueDays} days overdue</div>
            </div>
            {/* Time Spent Card */}
            <div className="flex flex-col w-full justify-center items-center bg-green-100 rounded-2xl p-6">
            <img src={'/icons/greenclock.svg'} alt='calendar' width={33} height={33} style={{marginBottom:8}} />
              <div className="text-green-500 font-semibold  mb-2">Time spent</div>
              <div className="text-2xl font-bold text-gray-500 ">{project.timeSpent}</div>
              <div className="text-gray-500 text-sm">of {project.estimatedTime} estimated</div>
            </div>
            {/* Time Spent Today Card */}
            <div className="flex flex-col w-full justify-center items-center bg-purple-100 rounded-2xl p-6">
            <img src={'/icons/todayspent.svg'} alt='calendar' width={33} height={33} style={{marginBottom:8}} />
              <div className="text-purple-500 font-semibold  mb-2">Time spent</div>
              <div className="text-2xl font-bold text-gray-500">{project.timeSpentToday}</div>
              <div className="text-purple-500 text-sm">worked today</div>
            </div>
            {/* Completed Card (again, as in img) */}
            <div className="flex flex-col w-full justify-center items-center  bg-orange-100 rounded-2xl p-6 relative">
            <img src={'/icons/lastactivity.svg'} alt='calendar' width={33} height={33} style={{marginBottom:8}} />
              <div className="text-orange-500 font-semibold  mb-2">Completed</div>
              <div className="text-2xl font-bold text-gray-500">{project.completedDate}</div>
              <div className="text-orange-500 font-bold text-base mt-2">{project.overdueDays} days overdue</div>
            </div>
          </div>
          <div style={{marginTop:20}} className='mt-5 flex flex-col gap-5'>
            <h2 className='text-[#404D61] font-semibold text-lg '>Technologies</h2>
            <div className='flex gap-2'>
              <span className='py-2 px-3 bg-[#E0EDFF] text-[#5F6ED1] border border-[#0066FF87] text-xs font-medium rounded-[20px]'>Node Js</span>
              <span className='py-2 px-3 bg-[#E0EDFF] text-[#5F6ED1] border border-[#0066FF87] text-xs font-medium rounded-[20px]'>JWT</span>
              <span className='py-2 px-3 bg-[#E0EDFF] text-[#5F6ED1] border border-[#0066FF87] text-xs font-medium rounded-[20px]'>Swagger</span>
              <span className='py-2 px-3 bg-[#E0EDFF] text-[#5F6ED1] border border-[#0066FF87] text-xs font-medium rounded-[20px]'>All</span>
            </div>
            <div className='grid grid-cols-3 gap-4'>
              <Button 
                size={'lg'} 
                className='flex justify-center col-span-2 cursor-pointer text-white bg-[#5F6ED1E5] items-center py-4'
                onClick={() => {
                  // Navigate to project details page with the project ID
                  const projectIndex = projects.indexOf(project);
                  navigate(`/projects/${projectIndex + 1}`);
                }}
              >
                <img src={'/icons/details.svg'} alt='details' width={30} height={19}/> View Details
              </Button>
              <div className='flex gap-4'>
                <div className=' border border-[#5F6ED1] rounded-2xl flex gap-2 py-2 px-2'>
                  <img src={'/icons/projectCommit.svg'} alt='commit' width={20} height={20} className=""/>
                  <span className='text-[#5F6ED1] text-lg font-medium'>Commits</span>
                </div>
                <div className=' border border-[#FC7C4E] flex gap-2 py-2 rounded-2xl px-2'>
                  <img src={'/icons/projectactvity.svg'} alt='like' width={24} height={18} className=""/>
                  <span className='text-[#FC7C4E] text-lg font-medium'>Activity</span>
                </div>
              </div >
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectListCard