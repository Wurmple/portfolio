import { useEffect, useState } from "react";
import LaptopScene from "../scene/LaptopScene";

const Hero = ({id, className}) => {
  const [greeting, setGreeting] = useState('');
  const [oneLiner, setOneLiner] = useState('');

  useEffect(() => {
    setTimeout(() => {
      console.log("Waited for 2 seconds, starting greeting sequence!");

      const fullGreeting = "Hey there, I'm Shyam 👋";
      const fullOneLiner = "I build bold, functional, and unforgettable digital experiences.";

      let i=0;
      const typeGreeting = () => {
        if(i < fullGreeting.length) {
          setGreeting(fullGreeting.slice(0,i+1));
          i++;
          setTimeout(typeGreeting, 100);
        } else {
          let j=0;
          const typeOneLiner = () => {
            console.log("CALLED TYPEONELINER");
            if(j < fullOneLiner.length) {
              setOneLiner(fullOneLiner.slice(0,j+1));
              j++;
              setTimeout(typeOneLiner,50);
            }
          };
          
          typeOneLiner();
        }
      };

      typeGreeting();
    }
    ,1000);
  }, []);

    return (
      <div id={id} className={`h-[91vh] flex border-black border-b-4 w-screen ${className}`}>
        <div className="border-r-2 border-black w-1/2 bg-lime-200 flex flex-col justify-center font-jetbrains gap-8 px-10 pt-20 pb-0">
            <h1 className="text-6xl font-extrabold">{greeting}</h1>
            <h2 className="text-3xl text-end text-gray-800">{oneLiner}</h2>
            <LaptopScene></LaptopScene>
        </div>
        <div className="border-l-2 border-black w-1/2 bg-pink-300 flex items-center justify-center">
            <div className="border-t-4 border-r-4 border-l-8 border-b-8 border-black px-4 py-8 max-w-full max-h-full flex flex-col gap-4 bg-teal-200 rounded-lg">
                <img src="shyam.jpg" className="border-2 border-black object-contain w-full max-h-96" alt="Shyam Poduval"></img>
                <p className="font-jetbrains shadow-lg bg-pink-300 self-end px-1 py-2">Shyam Poduval</p>
            </div>
        </div>
      </div>
    );
  };
  
  export default Hero;