import React from "react";
import Link from "next/link";

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=0c064b242e744e0ca6d6dbbc5458c704&response_type=code&redirect_uri=http://localhost:3000&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

const login = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center" >
      <a className="bg-[#FF293F] text-white px-5 py-2 rounded-sm" href={AUTH_URL} >Login with Apple music</a>
    </div>
  );
};

export default login;
