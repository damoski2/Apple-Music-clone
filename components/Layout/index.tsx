import React, { ReactNode, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import SideBar from "./SideBar";
import AudioBar from "./AudioBar";
import Loader from "../Loader";

interface Props {
  children: ReactNode;
}

const Index = ({ children }: Props) => {
  const { loading } = useContext(GlobalContext);

  return (
    <div className="h-full overflow-hidden w-full font-sf-pro flex flex-row">
      <SideBar />

      <div className="main-screen">
        {loading.value && loading?.state == 'load_artists' ? (
          <Loader />
        ) : (
          <>
            <AudioBar />
            {children}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
