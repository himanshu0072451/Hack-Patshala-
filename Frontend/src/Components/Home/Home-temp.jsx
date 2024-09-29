import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="relative flex min-h-screen flex-col justify-center items-center bg-black overflow-x-hidden"
      style={{
        fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif',
      }}
    >
      <div className="flex flex-col h-full w-[80%]">
        {/* Main Content Section */}
        <div className="flex flex-1 justify-center py-5 px-40">
          <div className="flex flex-col max-w-[960px] flex-1">
            <h1 className="text-white text-2xl font-bold leading-tight text-center pb-3 pt-6">
              Welcome, Teacher
            </h1>

            {/* Toggle between Sign Up / Login */}
            <div className="flex px-4 py-3 justify-center">
              <div className="flex h-10 w-full items-center justify-center rounded-full bg-[#333333] p-1">
                <label
                  className={`flex cursor-pointer h-full w-1/2 items-center justify-center rounded-full text-sm font-medium leading-normal ${
                    !isLogin ? "bg-black text-white" : "text-[#CBCBCB]"
                  }`}
                  onClick={() => setIsLogin(false)}
                >
                  <span className="truncate">Sign Up</span>
                  <input
                    type="radio"
                    name="auth-switch"
                    className="hidden"
                    value="Sign Up"
                  />
                </label>
                <label
                  className={`flex cursor-pointer h-full w-1/2 items-center justify-center rounded-full text-sm font-medium leading-normal ${
                    isLogin ? "bg-black text-white" : "text-[#CBCBCB]"
                  }`}
                  onClick={() => setIsLogin(true)}
                >
                  <span className="truncate">Login</span>
                  <input
                    type="radio"
                    name="auth-switch"
                    className="hidden"
                    value="Login"
                  />
                </label>
              </div>
            </div>

            {/* Input Fields */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  placeholder="Username"
                  className="form-input w-full rounded-xl text-white focus:outline-none border bg-black border-[#434343] h-14 placeholder:text-[#CBCBCB] p-[15px]"
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  type="password"
                  placeholder="Password"
                  className="form-input w-full rounded-xl text-white focus:outline-none border bg-black border-[#434343] h-14 placeholder:text-[#CBCBCB] p-[15px]"
                />
              </label>
            </div>

            {/* Buttons */}
            <div className="flex px-4 py-3 justify-center">
              <button className="flex min-w-[84px] max-w-[480px] items-center justify-center rounded-full h-12 bg-white text-black font-bold leading-normal">
                {isLogin ? "Log In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-center">
          <div className="max-w-[960px] flex-1 flex-col">
            <p className="text-[#CBCBCB] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">
              Business Solutions - We're hiring - Blog - About
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
