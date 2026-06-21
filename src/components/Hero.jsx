import { Suspense, lazy } from 'react';
import personal from '../data/personal';

const LaptopScene = lazy(() => import('../scene/LaptopScene'));

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Hero({ id }) {
  return (
    <section
      id={id}
      className="section-snap flex flex-col lg:flex-row w-screen border-b-4 border-black pt-16"
    >
      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="flex flex-col justify-between bg-lime-200 w-full lg:w-[55%] border-r-0 lg:border-r-4 border-black px-8 sm:px-14 py-8 sm:py-12 h-full">

        {/* Top: avatar + location */}
        <div className="flex items-center gap-4 flex-wrap">
          <img
            src="shyam.jpg"
            alt="Shyam Poduval"
            className="h-14 w-14 rounded-full object-cover border-4 border-black shrink-0"
          />
          <span className="font-jetbrains text-xs sm:text-sm border-2 border-black bg-white px-3 py-1.5 shadow-brutal-sm">
            📍 {personal.location}
          </span>
          <span className="font-jetbrains text-xs sm:text-sm border-2 border-black bg-lime-300 px-3 py-1.5 shadow-brutal-sm flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse inline-block" />
            Available for opportunities
          </span>
        </div>

        {/* Middle: name + role + bio */}
        <div className="flex flex-col gap-4 my-6 sm:my-0">
          <h1 className="font-k2d font-extrabold uppercase leading-[0.9] text-[clamp(3.5rem,9vw,6rem)] tracking-tight">
            {personal.firstName}
            <br />
            <span className="relative inline-block">
              {personal.lastName}
              <span className="absolute -bottom-2 left-0 right-0 h-[6px] bg-black" />
            </span>
          </h1>

          <div className="flex items-center gap-3 mt-4">
            <div className="bg-black text-lime-200 font-jetbrains text-sm sm:text-base px-4 py-2 font-bold shrink-0">
              {personal.headline}
            </div>
          </div>

          <p className="font-jetbrains text-sm sm:text-base text-gray-800 border-l-4 border-black pl-4 max-w-sm sm:max-w-md leading-relaxed">
            {personal.bio}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => scrollTo('experience')}
            className="bg-black text-white font-k2d font-extrabold text-base sm:text-lg px-6 py-3 border-4 border-black shadow-brutal btn-brutal"
          >
            VIEW MY WORK ↓
          </button>
          <a
            href={personal.resumePath}
            download="Shyam_Poduval_Resume.pdf"
            className="bg-white text-black font-k2d font-extrabold text-base sm:text-lg px-6 py-3 border-4 border-black shadow-brutal btn-brutal text-center"
          >
            DOWNLOAD RESUME ↗
          </a>
        </div>

        {/* Social links */}
        <div className="flex gap-3 flex-wrap mt-4 lg:mt-0">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-jetbrains text-sm font-bold border-4 border-black bg-white px-4 py-2 shadow-brutal-sm btn-brutal"
          >
            GitHub
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-jetbrains text-sm font-bold border-4 border-black bg-white px-4 py-2 shadow-brutal-sm btn-brutal"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${personal.email}`}
            className="font-jetbrains text-sm font-bold border-4 border-black bg-white px-4 py-2 shadow-brutal-sm btn-brutal"
          >
            Email
          </a>
        </div>
      </div>

      {/* ── Right panel: 3D laptop ──────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-center bg-black w-[45%] h-full border-t-0 border-black">
        <Suspense fallback={
          <div className="text-white font-jetbrains text-sm animate-pulse">Loading 3D...</div>
        }>
          <LaptopScene />
        </Suspense>
      </div>
    </section>
  );
}
