import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const SideBarData = [
    {
      title: "Dashboard",
      icon: "/icons/dashboard.svg",
      link: "/",
      number: 5,
    },
    {
      title: "My Projects",
      icon: "/icons/folder.svg",
      link: "/projects",
      number: 5,
    },
    {
      title: "Time Tracker",
      icon: "/icons/time.svg",
      link: "/teams",
      status: "active",
    },
  ];

  const handleNavigation = (link: string) => {
    navigate(link); // use React Router navigation instead of window.location.href
  };

  return (
    <div className="px-4 pt-9 pb-7 flex flex-col justify-between bg-[#F7F9FC] w-[272px] h-screen rounded-tr-3xl rounded-br-3xl shadow-md">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={"/icons/profile.svg"} width={44} height={44} alt="profile image" />
            <div className="flex flex-col">
              <p className="text-[#5A6474] text-xs font-light">Welcome back,</p>
              <p className="text-[#404D61] text-lg">Sarah Johnson</p>
            </div>
          </div>
          <img src={"/icons/video.svg"} width={24} height={24} alt="video icon" />
        </div>

        <div className="flex flex-col space-y-2 mt-10">
          {SideBarData.map((item, index) => (
            <div key={index} className="no-underline">
              <div
                className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-all duration-150 ${
                  path === item.link
                    ? "bg-[#5F6ED1] rounded-lg text-white"
                    : "hover:bg-[#E6E9F5] text-[#404D61]"
                }`}
                onClick={() => handleNavigation(item.link)}
              >
                <div className="flex gap-3 items-center">
                  <img src={item.icon} width={22} height={22} alt={`${item.title} icon`} />
                  <p className="text-base font-medium">{item.title}</p>
                  {item.status === "active" && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 font-semibold">
                      Active
                    </span>
                  )}
                </div>
                {item.number !== undefined && (
                  <div className="min-w-[20px] h-[20px] rounded-full bg-[#C6CCF640] flex items-center justify-center text-sm text-black">
                    {item.number}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#E6E9F5] rounded-lg transition-all duration-150">
        <img src={"/icons/settings.svg"} width={22} height={22} alt="settings icon" />
        <span className="text-base font-medium text-[#404D61]">Settings</span>
      </div>
    </div>
  );
};

export default SideBar;
