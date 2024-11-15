"use client";

import "./home.css";
import Image from "next/image";
import { motion, useAnimate } from "framer-motion";
import { useEffect } from "react";
import hero from "./assets/hero.svg";
import { FaGamepad, FaComments, FaTrophy, FaUserFriends } from "react-icons/fa"; 
import Link from "next/link";
import { Montserrat } from 'next/font/google';


const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function Home() {
  const welcomeMessage = "🏓 Welcome to our chat and ping pong hub! Let's play and connect for endless fun! 🚀";
  const wordsArray = welcomeMessage.split(" ");
  const [scope, animate] = useAnimate();

  useEffect(() => {
    wordsArray.forEach((_, index) => {
      animate(
        `span:nth-child(${index + 1})`,
        { opacity: 1, filter: "blur(0px)" },
        { duration: 1, delay: index * 0.2 }
      );
    });
  }, [scope]);

  const header = "PING";

  return (
    <div>
      <div className={`pt-5 sm:h-full p-5 overflow-auto pb-5 ${montserrat.className}`} id="home">
        <div className="container mx-auto ">
          <div className="flex justify-between items-center">
            <p className="mr-auto">Created By</p>
            <h2 className="mr-auto font-extrabold text-5xl text-[#04578B] hover:text-white mt-5">
              {header}
            </h2>
            <Link href="/signin">
              <motion.button
                className="ml-auto login font-bold p-4 rounded-2xl hover:opacity-90"
                whileHover={{ scale: 1.1 }}
              >
                Login
              </motion.button>
            </Link>
          </div>

          <div className="flex flex-col flex-col-reverse md:flex-row mt-5 text-center justify-center items-center h-screen">
            <div className="w-full md:w-1/2 text-center flex flex-col justify-center items-center">
              <motion.h1
                className="text-2xl sm:mt-4 sm:mb-4 font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <div ref={scope}>
                  {wordsArray.map((word, index) => (
                    <span key={index} className="inline-block opacity-0 filter blur-sm">
                      {word}
                      {index < wordsArray.length - 1 && <span className="mr-2" />} 
                    </span>
                  ))}
                </div>
              </motion.h1>
             
              <div className="grid grid-cols-2 gap-4 mt-5 p-4 rounded-2xl text-left sm:bg-blue-400 font-semibold" id="feat">
                {[
                  { icon: <FaGamepad />, label: "Play Games" },
                  { icon: <FaComments />, label: "Chat" },
                  { icon: <FaTrophy />, label: "Compete" },
                  { icon: <FaUserFriends />, label: "Connect" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="p-5 flex flex-col justify-center items-center text-center rounded-2xl shadow-2xl border-2 cursor-pointer border-[#94B8DB]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.2, duration: 0.6 }}
                  >
                    <div className="icon-container text-4xl mb-2">{item.icon}</div>
                    <span className="text-lg">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* </PinContainer> */}
              <Link href="/signup">
                <motion.button
                  className="rounded-2xl text-center mt-10 hover:opacity-90 text-[22px] w-[20px] h-[20px] bg-"
                  id="signup"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  Sign up
                </motion.button>
              </Link>
            </div>

            <motion.div
              className="w-full md:w-1/2 ml-5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <Image className="mx-auto" src={hero} alt="Ping Pong Hero" id="hero" />
    
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}