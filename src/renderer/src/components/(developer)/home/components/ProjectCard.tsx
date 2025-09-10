
import React from 'react'
import ProjectProgress from './ProjectProgress'

export interface projectCard{
    amount:string,
    status:string,
    colors:string,
    textColor:string
}

const ProjectCard = ({cardData}:{cardData:projectCard[]}) => {
    
  return (
    <div className='p-6  lg:p-8 rounded-2xl bg-white shadow-lg'>
      {/* Header */}
      <div className='flex items-center gap-4 pb-6'>
        <img src={'/icons/target.svg'} alt='target' width={40} height={40}/>
        <h1 className='text-xl lg:text-2xl font-bold text-[#7080F0]'>Current Project: E-commerce Dashboard</h1>
      </div>
      
      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 pb-8'>
        {cardData.map((item,idx) => (
          <div key={idx} className='flex flex-col items-center py-6 px-4 rounded-2xl' style={{background: item.colors}}>
            <p className='text-2xl lg:text-3xl font-bold pb-2' style={{color: item.textColor}}>{item.amount}</p>
            <p className='font-medium text-sm lg:text-base text-center' style={{color: item.textColor}}>{item.status}</p>
          </div>
        ))}
      </div>
      
      {/* Project Progress */}
      <ProjectProgress/>
    </div>
  )
}

export default ProjectCard