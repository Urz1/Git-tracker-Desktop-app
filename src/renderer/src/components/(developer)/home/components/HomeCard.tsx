

import React from 'react'

export interface CardData {
    title?: string;
    width:number
    height:number
    value: string;
    icon: string;
    progress?: string;
    day: string;
    message?: string;
    colors:string;
}

const HomeCard = ({ cardData }: { cardData: CardData[] }) => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
    {cardData.map((item, idx) => (
      <div key={idx} className='p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow'>
        <div className='flex flex-col h-full'>
          {/* Icon and value section */}
          <div className='flex items-start justify-between pb-4'>
            <div
              className='w-12 h-12 rounded-xl flex justify-center items-center shadow-sm'
              style={{ background: item.colors }}
            >
              <img src={item.icon} alt={item.title || ""} width={item.width} height={item.height} className="w-8 h-8" />
            </div>
            
            <div className='px-3 py-1 rounded-full text-xs font-semibold text-white' 
                 style={{background: item.colors, opacity: 0.8}}>
              {item.day}
            </div>
          </div>
          
          {/* Value */}
          <h1 className='text-3xl font-bold pb-3' style={{color: item.colors}}>
            {item.value}
          </h1>
          
          {/* Progress and message */}
          <div className='mt-auto'>
            <p className='text-sm font-semibold text-gray-600 pb-2'>{item.progress}</p>
            <p className='text-sm text-gray-500'>{item.message}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default HomeCard