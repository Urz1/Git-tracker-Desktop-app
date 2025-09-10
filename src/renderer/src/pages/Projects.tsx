import HomeCard, { CardData } from '@renderer/components/(developer)/home/components/HomeCard'
import Header from '@renderer/components/(developer)/projects/components/Header'
import ProjectListCard from '@renderer/components/(developer)/projects/components/ProjectListCard'


const page = () => {
  const cardData: CardData[] = [
    {
        progress: "Assigned Projects",
        width:37,
        height:37,
        value: "3",
        icon: "/icons/assigned.svg",
        day:"Total",
      
        colors:"#6E7BD6"

    },
    {
        progress: "In Progress",
        width:19,
        height:21,
        value: "1",
        icon: "/icons/inprogress.svg",
        
        day:"done",
        
        colors:"#FCCA4E"
    },
    {
        progress: "Completed",
        width:32,
        height:32,
        value: "8",
        icon: "/icons/completed.svg",
        
        day:"Today",
       
        colors:"#28B446"
    },
    {
        progress: "Assigned Projects",
        width:31,
        height:31,

        value: "9",
        icon: "/icons/assignedtime.svg",
       
        day:"Active",
        
        colors:"#983BED"
    }
]

  // Sample project data for ProjectListCard
  const projectData = [
    {
      title: "E-commerce Mobile App",
      description: "Developing a comprehensive mobile application for online shopping with payment integration and user management",
      status: "In Progress",
      imageUrl: "/images/profile.svg",
      progressPercent: "65",
      completedDate: "1/25/2024",
      overdueDays: 3,
      timeSpent: "16h",
      estimatedTime: "120h",
      timeSpentToday: "6.5h"
    },
    {
      title: "Dashboard Analytics Platform",
      description: "Building a real-time analytics dashboard for business metrics and performance monitoring",
      status: "In Progress",
      imageUrl: "/images/profile.svg",
      progressPercent: "42",
      completedDate: "2/15/2024",
      overdueDays: 0,
      timeSpent: "28h",
      estimatedTime: "80h",
      timeSpentToday: "4.2h"
    },
    {
      title: "AI Chatbot Integration",
      description: "Implementing machine learning chatbot for customer support automation",
      status: "In Progress",
      imageUrl: "/images/profile.svg",
      progressPercent: "78",
      completedDate: "1/30/2024",
      overdueDays: 8,
      timeSpent: "45h",
      estimatedTime: "60h",
      timeSpentToday: "8.1h"
    }
  ]

  return (
    <div className="p-8 bg-gray-100  min-h-screen">
      <Header/>
      <div className='pt-10'>
        <HomeCard cardData={cardData}/>
      </div>
      <div className='pt-8'>
        <ProjectListCard projects={projectData}/>
      </div>
    </div>
  )
}

export default page