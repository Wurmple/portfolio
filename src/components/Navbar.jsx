import { useState } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

function scrollTo(id) {
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleNav = (id) => {
    scrollTo(id);
    setOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 border-b-4 border-black bg-white z-[1000]">
        <div className="flex items-center justify-between h-full px-5 sm:px-8">
          {/* Brand */}
          <button
            onClick={() => handleNav('home')}
            className="font-k2d font-extrabold text-xl sm:text-2xl tracking-tight hover:opacity-70 transition-opacity"
          >
            SP
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-10">
            {sections.map(({ id, label }) => (
              <li
                key={id}
                onClick={() => handleNav(id)}
                className="font-k2d font-bold text-base lg:text-lg cursor-pointer border-b-[3px] border-transparent hover:border-black transition-all pb-0.5"
              >
                {label}
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden w-10 h-10 border-2 border-black flex flex-col justify-center items-center gap-1.5 hover:bg-gray-100 transition-colors"
          >
            <span className={`block w-6 h-0.5 bg-black transition-transform duration-200 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-black transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-black transition-transform duration-200 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-[999] md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute top-16 left-0 right-0 bg-white border-b-4 border-black shadow-[0_8px_0_0_#000]"
            onClick={(e) => e.stopPropagation()}
          >
            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className="w-full text-left px-8 py-4 font-k2d font-bold text-lg border-b-2 border-black last:border-b-0 hover:bg-lime-200 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
