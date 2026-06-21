import personal from '../data/personal';

const links = [
  {
    href: `mailto:${personal.email}`,
    icon: 'mail.svg',
    label: personal.email,
    external: false,
  },
  {
    href: `tel:${personal.phone}`,
    icon: 'phone.svg',
    label: personal.phone,
    external: false,
  },
  {
    href: personal.linkedin,
    icon: 'linkedin.svg',
    label: 'linkedin.com/in/shyam-poduval-8b3138203',
    external: true,
  },
  {
    href: personal.github,
    icon: null,
    label: 'github.com/Wurmple',
    external: true,
    isGithub: true,
  },
];

const baseUrl = import.meta.env.BASE_URL || '/';

export default function Contact({ id }) {
  return (
    <section
      id={id}
      className="section-snap w-screen bg-lime-200 border-t-4 border-black flex flex-col justify-between pt-16"
    >
      {/* Header */}
      <div className="border-b-4 border-black px-6 sm:px-12 py-4 bg-white shrink-0">
        <h2 className="font-k2d font-extrabold text-3xl sm:text-4xl uppercase tracking-tight">
          Get In Touch
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">

        {/* Links column */}
        <div className="flex-1 flex flex-col justify-center gap-3 px-6 sm:px-12 py-6 border-b-4 lg:border-b-0 lg:border-r-4 border-black">
          {links.map(({ href, icon, label, external, isGithub }) => (
            <a
              key={href}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-5 bg-white border-4 border-black shadow-brutal px-5 py-3 hover:bg-gray-50 btn-brutal group"
            >
              {isGithub ? (
                <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              ) : (
                <img
                  src={`${baseUrl}${icon}`}
                  alt={label}
                  className="h-8 w-8 object-contain shrink-0 group-hover:scale-110 transition-transform"
                />
              )}
              <span className="font-jetbrains text-sm sm:text-base font-semibold truncate group-hover:underline">
                {label}
              </span>
            </a>
          ))}
        </div>

        {/* Resume + footer */}
        <div className="flex flex-col items-center justify-center gap-6 px-6 sm:px-12 py-8">
          <a
            href={personal.resumePath}
            download="Shyam_Poduval_Resume.pdf"
            className="bg-black text-white font-k2d font-extrabold text-xl sm:text-2xl border-4 border-black shadow-brutal btn-brutal flex items-center gap-4 px-6 sm:px-10 py-4 sm:py-6"
          >
            <span>DOWNLOAD RESUME</span>
            <img
              src={`${baseUrl}download.svg`}
              alt="download"
              className="h-7 invert"
            />
          </a>

          <p className="font-jetbrains text-xs text-gray-600 text-center mt-2">
            Built with React + Three.js · Deployed on GitHub Pages
          </p>
        </div>
      </div>
    </section>
  );
}
