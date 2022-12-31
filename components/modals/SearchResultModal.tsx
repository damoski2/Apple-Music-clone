import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { GlobalContext } from "../../context/GlobalContext";
import { Divider } from "antd";

const SearchResultModal = () => {
  const { dispatch, setGlobalSearchInput, searchResults, searchInput } =
    useContext(GlobalContext);

  return (
    <div className="fixed rounded-md w-[302px] max-h-[695px] p-[6px] h-fit bg-[#342250]/10 backdrop-blur-sm z-10 top-[100px] left-6 border-[.1px] border-[#fff] overflow-scroll text-[#fff] ">
      <ul>
        {searchResults?.map((result: any, index: number) => (
          <>
            <li
              key={index}
              className="flex items-center px-[25px] py-[10px] cursor-pointer">
              <Image src={result?.albumUrl} alt="" width={46} height={46} />
              <div className="flex flex-col ml-2">
                <span className="text-white text-[13px]">{result?.title}</span>
                <span className="text-xs text-[#BFBFBF] font-normal" >Song . {result?.artist}</span>
              </div>
            </li>
            {index !== searchResults.length - 1 && <Divider style={{ width: '90%' }} className="w-11/12 bg-[#BFBFBF] h-[.1px]" />}
          </>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultModal;
