import { useState } from 'react';
import skillsData from '../data/skills';

const baseUrl = import.meta.env.BASE_URL || '/';

export default function Skills({ id }) {
  const [active, setActive] = useState(0);
  const cat = skillsData[active];

  return (
    <section id={id} className="section-snap w-screen bg-pink-300 border-b-4 border-black flex flex-col pt-16">

      {/* Tab strip */}
      <div className="flex border-b-4 border-black shrink-0">
        {skillsData.map((c, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex-1 py-3 sm:py-4 font-k2d font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-wide border-r-4 border-black last:border-r-0 transition-colors ${
              active === i
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">

        {/* Icon grid */}
        <div className="bg-teal-200 border-r-0 md:border-r-4 border-black border-b-4 md:border-b-0 flex items-center justify-center p-6 sm:p-10">
          <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {cat.images.map((img, i) => (
              <div key={i} className="flex items-center justify-center">
                <img
                  src={`${baseUrl}${img}`}
                  alt={img.split('.')[0]}
                  className="h-14 w-14 sm:h-20 sm:w-20 object-contain border-4 border-black p-2.5 sm:p-3 bg-white shadow-brutal hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="bg-pink-300 p-6 sm:p-10 overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {cat.items.map((item, i) => (
              <li
                key={i}
                className="bg-white border-2 border-black px-4 py-2.5 font-jetbrains font-semibold text-sm sm:text-base shadow-brutal-sm hover:bg-gray-50 transition-colors flex items-center gap-3"
              >
                <span className="text-gray-400 font-bold">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
