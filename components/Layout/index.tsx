import React, { ReactNode } from "react";
import SideBar from "./SideBar";
import AudioBar from "./AudioBar";

interface Props {
  children: ReactNode;
}

const index = ({ children }: Props) => {
  return (
    <div className="h-screen overflow-hidden w-full font-sf-pro flex flex-row">
      <SideBar />
      <div className="main-screen">
        <AudioBar />
        {children}
      </div>
    </div>
  );
};

export default index;
