
import Headers from "@renderer/components/(developer)/home/components/Headers";
import HomeCard, { CardData } from "@renderer/components/(developer)/home/components/HomeCard";
import ProjectCard, { projectCard } from "@renderer/components/(developer)/home/components/ProjectCard";
import React, { use } from "react";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const navigate = useNavigate();;
  const cardData: CardData[] = [
    {
        title: "hours worked",
        width:47,
        height:45,
        value: "6.5H",
        icon: "/icons/time2.svg",
        progress: "hours worked",
        day:"Today",
        message:"Target: 8h",
        colors:"#7080F0"

    },
    {
        title: "commits today",
        width:47,
        height:45,
        value: "8",
        icon: "/icons/commits.svg",
        progress: "Commits Today",
        day:"Today",
        message:"Great progress!",
        colors:"#983BED"
    },
    {
        title: "commits made",
        width:47,
        height:45,
        value: "8",
        icon: "/icons/commits.svg",
        progress: "Commits Made",
        day:"Today",
        message:"Great progress!",
        colors:"#983BED"
    },
    {
        title: "activity score",
        width:47,
        height:45,
        value: "98%",
        icon: "/icons/activity.svg",
        progress: "Activity Score",
        day:"Today",
        message:"Great progress!",
        colors:"#FCCA4E"
    }
]
const projectCardData: projectCard[] = [
  { amount: "75%", status: "complete", colors: "#E0EDFF",textColor:"#6E7BD6" },
  { amount: "52h", status: "complete", colors: "#E8FDEF",textColor:"#2EC950" },
  { amount: "8", status: "complete", colors: "#F5ECFF",textColor:"#983BED" }
];
  return (
    <div className="p-8 bg-gray-100  min-h-screen">
      <Headers />
     <HomeCard cardData={cardData} />
      {/* Project Progress */}
      <div className="grid grid-cols-3 gap-6 pt-16">
    
        <div className="col-span-2"> <ProjectCard cardData={projectCardData}  /></div>
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl h-fit shadow p-6 flex flex-col gap-4">
          <div className="flex gap-2 items-center">
            <img src={'/icons/energy.svg'} alt="energy" width={43} height={43}/>
             <h4 className="text-[#5F6ED1] font-bold mb-2 text-3xl">Quick Actions</h4>
             </div>
         
          <button onClick={()=>{navigate('/projects')}}   className="flex items-center gap-2 cursor-pointer py-2 px-12  rounded-lg bg-[#5F6ED1] text-white font-semibold"> <img src={'icons/quickfiles.svg'} alt="" width={38} height={38}/>  View All Projects</button>
          <button className="flex items-center gap-2 cursor-pointer py-2 px-12 rounded-lg border  border-[#F6B93B] text-[#F6B93B] font-semibold"> <img src={'icons/quickeye.svg'} alt="" width={38} height={38}/> Time Tracker</button>
          <button className="flex items-center gap-2 cursor-pointer py-2 px-12 rounded-lg border border-[#5F6ED1] text-[#5F6ED1] font-semibold">
          <img src={'icons/quickcommit.svg'} alt="" width={38} height={14}/> Commit Changes</button>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;