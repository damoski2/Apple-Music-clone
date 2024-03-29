import React from "react";
import Image from "next/image";
import Link from "next/link";

import logo from "../assets/images/logo.png";

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=0c064b242e744e0ca6d6dbbc5458c704&response_type=code&redirect_uri=${
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://apple-music-cloned.vercel.app/"
}&scope=streaming%20user-read-email%20user-read-recently-played%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-public%20playlist-modify-private`;

const login = () => {
  return (
    <main className="py-8">
      <Image src={logo} alt="apple music logo" className="w-[13%] mx-auto" />

      <div className="line w-full h-[1px] bg-[#004350] mt-8" />

      <div className="mt-8">
        <p className="text-[#004350] text-center text-2xl font-semibold">
          Can only work with this account below
        </p>
        <p className="text-center text-lg font-semibold mt-2">
          <span className="text-[#FF293F]">email</span>: oyindacodes2@gmail.com
        </p>
        <p className="mt-2 text-center text-lg font-semibold">
          {" "}
          <span className="text-[#FF293F]">password</span>: password123
        </p>
      </div>

      <div className="h-[60vh] w-full flex justify-center items-center">
        <Link
          className="bg-[#FF293F] text-white px-8 py-4 rounded-lg decoration-[#fff] hover:decoration-[#fff]"
          href={AUTH_URL}
        >
          Login with Apple music
        </Link>
      </div>
    </main>
  );
};

export default login;
