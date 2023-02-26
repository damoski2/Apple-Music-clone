import React, { ReactNode, useContext, useEffect, useState, useRef } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import SideBar from "./SideBar";
import AudioBar from "./AudioBar";
import TaskBar from './TaskBar'
import SearchResultModal from "../modals/SearchResultModal";

interface Props {
  children: ReactNode;
}

const Index = ({ children }: Props) => {
  const ref = useRef<any>(null);
  const { loading, searchResults, setGlobalSearchInput, dispatch } = useContext(GlobalContext);

  const [displaySearchResult, setDisplaySearchResult] = useState<boolean>(false);

  useEffect(()=>{
    searchResults && setDisplaySearchResult(true)
  },[searchResults])

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref?.current && !ref?.current?.contains(e.target)) {
        setTimeout(()=>{
          setDisplaySearchResult(false)
          setGlobalSearchInput("", dispatch);
        },1000)
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
  }, [ref]);

  return (
    <div className="h-full overflow-hidden w-full font-sf-pro flex flex-row">
      <SideBar refPasser={ref} />
      {displaySearchResult && searchResults.length > 0 && <SearchResultModal />}

      <div className="main-screen">
            <AudioBar />
            {children}
      </div>
    </div>
  );
};

export default Index;
