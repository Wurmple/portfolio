import { useEffect, useState } from "react";
import LaptopScene from "../scene/LaptopScene";

const Hero = ({ id, className }) => {
  const fullGreeting = "Hey there, I'm Shyam 👋";
  const fullOneLiner = "I build bold, functional, and unforgettable digital experiences.";

  useEffect(() => {
    let i = 0;
    let j = 0;
    const cursor = document.querySelectorAll(".cursor");

    const blinkCursor = setInterval(() => {
      cursor.forEach((c) => c.classList.toggle("opacity-0"));
    }, 500);

    const typeText = () => {
      if (i < fullGreeting.length) {
        document.getElementById("greeting").textContent = fullGreeting.slice(0, i + 1);
        i++;
        setTimeout(typeText, 100);
      } else {
        console.log("Greeting is fully typed!");
        const typeOneLiner = () => {
          if (j < fullOneLiner.length) {
            document.getElementById("oneLiner").textContent = fullOneLiner.slice(0, j + 1);
            j++;
            setTimeout(typeOneLiner, 50);
          } else {
            clearInterval(blinkCursor);
            cursor.forEach((c) => c.classList.add("hidden"));
          }
        };
        typeOneLiner();
      }
    };

    setTimeout(typeText, 1000);

    return () => clearInterval(blinkCursor);
  }, []);

  return (
    <div id={id} className={`flex flex-col lg:flex-row h-[91vh] border-black border-b-4 w-screen ${className}`}>
      <div className="border-r-2 border-black w-full lg:w-1/2 bg-lime-200 flex flex-col justify-between items-start font-jetbrains gap-24 px-10 pt-20 pb-0">
        <div className="flex flex-col gap-12">
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-start invisible">{fullGreeting}</h1>
            <h1 className="absolute top-0 left-0 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-start">
              <span id="greeting"></span>
              <span className="cursor">|</span>
            </h1>
          </div>
          <div className="relative text-right">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-800 invisible">{fullOneLiner}</h2>
            <h2 className="absolute top-0 right-0 text-xl sm:text-2xl lg:text-3xl text-gray-800">
              <span id="oneLiner"></span>
              <span className="cursor">|</span>
            </h2>
          </div>
        </div>
        <LaptopScene />
      </div>
      <div className="border-l-2 border-black w-full lg:w-1/2 bg-pink-300 flex items-center justify-center">
        <div className="relative border-t-4 border-r-4 border-l-8 border-b-8 border-black px-4 py-8 max-w-full max-h-full flex flex-col gap-4 bg-teal-200 rounded-lg">
          <img
            src="shyam.jpg"
            className="border-2 border-black object-contain w-full max-h-96 hover:shadow-lg hover:scale-105 transition duration-300"
            alt="Shyam Poduval"
          />
          <p className="font-jetbrains shadow-lg bg-pink-300 self-end px-1 py-2 hover:scale-110 transition duration-300">Shyam Poduval</p>
          <img
            src="curved-arrow.svg"
            className="absolute bottom-[-5rem] right-[-5rem] max-h-24 lg:bottom-[-10rem] lg:right-[-10rem] lg:max-h-44 rotate-[-30deg] hover:rotate-[-35deg] hover:scale-110 transition duration-300"
            alt="arrow"
          />
          <img
            src="blob.svg"
            className="absolute top-[-2rem] left-[-10rem] max-h-36 lg:top-[-4rem] lg:left-[-20rem] lg:max-h-72 rotate-[60deg] hover:scale-110 transition duration-300"
            alt="blob"
          />
          <img
            src="user.svg"
            className="absolute top-[-5rem] right-[-9rem] max-h-32 lg:top-[-10rem] lg:right-[-18rem] lg:max-h-64 hover:scale-110 transition duration-300"
            alt="user"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;