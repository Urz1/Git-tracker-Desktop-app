
import SideBar from "@/components/SideBar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex ">
      <SideBar />
      <div className="flex-1 w-full">{children}</div>
     
    </div>
  );
};

export default layout;