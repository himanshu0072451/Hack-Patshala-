import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import ButtonAnimation from "../AnimationButton/ButtonAnimation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const SideBar = ({ menuClick, setMenuClick, notify }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const token = Cookies.get("token");
  const [isDisplayed, setIsDisplayed] = useState(false);

  useEffect(() => {
    const decodeToken = () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const role = decodedToken.user.role;
          setUserRole(role);
        } catch (err) {
          setUserRole(null); // Clear role if there's an error
          console.error("Error decoding token:", err);
          notify("Error decoding token", "error");
        }
      } else {
        setUserRole(null); // No token, so no role
      }
    };

    decodeToken();
  }, [token, notify]);

  useEffect(() => {
    if (menuClick) {
      setIsDisplayed(true);
    }
  }, [menuClick]);

  const Data = [
    { name: "Home", path: "/" },
    { name: "Notes", path: "/notes" },
    { name: "Syllabus", path: "/" },
    { name: "PYQ", path: "/PYQ" },
    userRole === "teacher" && { name: "Upload Notes", path: "/upload-notes" },
    {
      name: "Dashboard",
      path:
        userRole === "teacher" ? "/teacher/dashboard" : "/student/dashboard",
    },
  ].filter(Boolean);

  useEffect(() => {
    setMenuClick(false);
  }, [location, setMenuClick]);

  return (
    <motion.div
      initial={{ left: "-100%" }}
      animate={{ left: menuClick ? "0" : "-100%" }}
      transition={{
        duration: 0.9,
        ease: [0.6, 0.05, -0.01, 0.9],
      }}
      onAnimationComplete={() => {
        if (!menuClick) {
          setIsDisplayed(false);
        }
      }}
      style={{
        display: isDisplayed || menuClick ? "flex" : "none",
      }}
      className="SideBar fixed top-0 h-full w-full lg:w-[35rem] font-[Satoshi] z-[999] px-4 lg:pl-[1.5rem] overflow-y-auto"
    >
      <div className="Sidebar-main min-h-full w-full lg:w-[32rem] flex justify-center items-center">
        <div className="sideBar-wrap bg-[#0F1215] h-[95%] w-full  rounded-md overflow-hidden p-6 border-[0.5px] border-zinc-500">
          <div className="top flex h-16 w-full justify-between items-center text-zinc-100">
            <div className="topWrap h-full w-full flex justify-between items-center">
              <motion.div
                onClick={() => setMenuClick(false)}
                className="close cursor-pointer h-8 w-8 border-[1.5px] border-zinc-100 rounded-lg flex justify-center items-center"
              >
                <IoClose className="font-[900] text-lg" />
              </motion.div>
            </div>
          </div>
          <div className="main-content h-[88%] w-full">
            {Data.map((elem, index) => (
              <ButtonAnimation
                key={index}
                path={elem.path}
                index={index}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
                name={elem.name}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default SideBar;

// ----------------------------------------------------------

// import React, { useEffect, useState } from "react";
// import { NavLink, useLocation } from "react-router-dom";
// import { IoClose } from "react-icons/io5";
// import { motion } from "framer-motion";
// import ButtonAnimation from "../AnimationButton/ButtonAnimation";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode

// const SideBar = ({ menuClick, setMenuClick, notify }) => {
//   const [hoverIndex, setHoverIndex] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const location = useLocation();
//   const token = Cookies.get("token");
//   const [isDisplayed, setIsDisplayed] = useState(false);

//   useEffect(() => {
//     const decodeToken = () => {
//       if (token) {
//         try {
//           const decodedToken = jwtDecode(token);
//           const role = decodedToken.user.role;
//           setUserRole(role);
//         } catch (err) {
//           setUserRole(null);
//           console.error("Error decoding token:", err);
//           notify("Error decoding token", "error");
//         }
//       } else {
//         setUserRole(null); // No token, so no role
//       }
//     };
//     decodeToken();
//   }, [token, notify]);

//   useEffect(() => {
//     if (menuClick) {
//       setIsDisplayed(true);
//     }
//   }, [menuClick]);

//   const Data = [
//     { name: "Home", path: "/" },
//     { name: "Notes", path: "/notes" },
//     { name: "Syllabus", path: "/" },
//     { name: "PYQ", path: "/PYQ" },
//     userRole === "teacher" && { name: "Upload Notes", path: "/upload-notes" },
//     { name: "Dashboard", path: "/teacher/dashboard" },
//   ].filter(Boolean);

//   // Check if current route is the dashboard
//   const isDashboard = location.pathname.includes("/teacher/dashboard");

//   useEffect(() => {
//     // Close sidebar when navigating to a different route, except dashboard
//     if (!isDashboard) {
//       setMenuClick(false);
//     }
//   }, [location, setMenuClick, isDashboard]);

//   return (
//     <motion.div
//       initial={{ left: isDashboard ? "0" : "-100%" }} // Fixed sidebar on dashboard
//       animate={{ left: isDashboard || menuClick ? "0" : "-100%" }}
//       transition={{
//         duration: 0.9,
//         ease: [0.6, 0.05, -0.01, 0.9],
//       }}
//       onAnimationComplete={() => {
//         if (!menuClick && !isDashboard) {
//           setIsDisplayed(false);
//         }
//       }}
//       style={{
//         display: isDisplayed || menuClick || isDashboard ? "flex" : "none",
//       }}
//       className={`SideBar ${isDashboard && "lg:w-[20rem] lg:pl-0"} fixed top-0 h-full w-full lg:w-[35rem] font-[Satoshi] z-[999] px-4 lg:pl-[1.5rem] overflow-y-auto`}
//     >
//       <div className="Sidebar-main min-h-full w-full lg:w-[32rem] flex justify-center items-center">
//         <div className={`sideBar-wrap ${isDashboard && "h-[55%] mt-16 bg-zinc-600 border-none pl-0"} bg-[#0F1215] h-[95%] w-full rounded-md overflow-hidden p-6 border-[0.5px] border-zinc-500`}>
//           <div className="top flex h-16 w-full justify-between items-center text-zinc-100">
//             <div className="topWrap h-full w-full flex justify-between items-center">
//               {!isDashboard && (
//                 <motion.div
//                   onClick={() => setMenuClick(false)}
//                   className="close cursor-pointer h-8 w-8 border-[1.5px] border-zinc-100 rounded-lg flex justify-center items-center"
//                 >
//                   <IoClose className="font-[900] text-lg" />
//                 </motion.div>
//               )}
//             </div>
//           </div>
//           <div className="main-content h-[88%] w-full">
//             {Data.map((elem, index) => (
//               <ButtonAnimation
//                 key={index}
//                 path={elem.path}
//                 index={index}
//                 hoverIndex={hoverIndex}
//                 setHoverIndex={setHoverIndex}
//                 name={elem.name}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default SideBar;
