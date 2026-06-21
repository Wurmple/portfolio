import educationData from '../data/education';

function EducationCard({ edu, accent }) {
  return (
    <div
      className={`border-4 border-black shadow-brutal flex flex-col gap-3 p-5 sm:p-7 ${accent}`}
    >
      {/* Period badge */}
      <span className="font-jetbrains text-xs font-bold border-2 border-black bg-white px-2 py-1 self-start shadow-brutal-sm">
        {edu.period}
      </span>

      {/* Institution */}
      <div>
        <h3 className="font-k2d font-extrabold text-xl sm:text-2xl uppercase leading-tight">
          {edu.shortName}
        </h3>
        <p className="font-jetbrains text-xs sm:text-sm text-gray-700 mt-0.5">{edu.institution}</p>
      </div>

      {/* Degree */}
      <div className="border-l-4 border-black pl-3">
        <p className="font-k2d font-bold text-base sm:text-lg">{edu.degree}</p>
        {edu.field && (
          <p className="font-jetbrains text-xs sm:text-sm text-gray-700">{edu.field}</p>
        )}
      </div>

      {/* Grade */}
      <div className="bg-black text-white font-jetbrains font-bold text-sm px-3 py-2 self-start">
        {edu.grade}
      </div>

      {/* Activities */}
      {edu.activities.length > 0 && (
        <div>
          <p className="font-jetbrains text-xs font-bold uppercase text-gray-500 mb-1.5">Activities</p>
          <ul className="flex flex-col gap-1">
            {edu.activities.map((a, i) => (
              <li key={i} className="font-jetbrains text-xs sm:text-sm flex gap-2">
                <span className="text-gray-400">→</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const accents = ['bg-white', 'bg-lime-100'];

export default function Education({ id }) {
  return (
    <section id={id} className="section-snap w-screen bg-teal-200 border-b-4 border-black flex flex-col pt-16">

      {/* Header bar */}
      <div className="border-b-4 border-black px-6 sm:px-12 py-4 bg-white shrink-0">
        <h2 className="font-k2d font-extrabold text-3xl sm:text-4xl uppercase tracking-tight">
          Education
        </h2>
      </div>

      {/* Cards */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch gap-0 min-h-0 overflow-y-auto md:overflow-hidden">
        {educationData.map((edu, i) => (
          <div
            key={i}
            className={`flex-1 p-6 sm:p-10 flex items-center justify-center ${i < educationData.length - 1 ? 'border-b-4 md:border-b-0 md:border-r-4 border-black' : ''}`}
          >
            <EducationCard edu={edu} accent={accents[i] ?? 'bg-white'} />
          </div>
        ))}
      </div>
    </section>
  );
}
