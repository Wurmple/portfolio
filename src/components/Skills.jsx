import React from 'react'

const Skills = ({id, className}) => {
  const languagesAndFrameworks = ["Java", "Python", "JavaScript/TypeScript", "React.js", "Spring Boot", "Angular", "Node.js", "Express.js", "Django"];
  const languagesAndFrameworksImages = ["java.svg", "python.png", "react.svg", "angular.png", "spring-boot.svg", "nodejs.svg"];
  const technologies = ['Docker', 'MongoDB', 'MySQL', 'GCP', ' Apache Kafka', ' HDFS', ' Git', ' BigQuery', 'Nginx', 'Solr', 'Redis', 'Jenkins'];
  const technologiesImages = ["docker.svg", "gcp.svg", "kafka.svg", "git.svg", "pubsub.svg", "nginx.svg"];
  const concepts = ['OOP', 'DSA', 'DBMS', 'System Design', 'Microservices', 'ETL', 'REST APIs', 'CI/CD', 'Statistical Analysis'];
  const conceptsImages = ["oop.svg", "dbms.svg", "system-design.svg", "microservices.svg", "ci-cd.svg", "data-analysis.svg"];

  return (
    <div id={id} className={`grid grid-cols-2 grid-rows-3 w-screen ${className}`}>
      {/* Languages and Frameworks Images */}
      <div className="bg-pink-300 p-4 border-black border-r-2 border-b-2 flex justify-center items-center">
        <div className="grid grid-cols-3 gap-x-16 gap-y-12">
          {languagesAndFrameworksImages.map((image, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={image}
                alt={image.split('.')[0] || "technologia"}
                className="max-w-full h-24 object-contain border-4 border-black p-2 shadow-lg transform hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Languages and Frameworks List */}
      <div className="bg-teal-200 py-8 px-4 flex flex-col gap-5 font-jetbrains border-black border-l-2 border-b-2 tracking-wide">
        <h1 className='text-3xl font-extrabold uppercase'>Languages and Frameworks</h1>
        <ul className='font-semibold flex flex-col gap-1'>
          {languagesAndFrameworks.map((laf, index) => (
            <li key={index} className="bg-white border-2 border-black p-2 hover:bg-gray-200">✨ {laf}</li>
          ))}
        </ul>
      </div>

      {/* Technologies List */}
      <div className="bg-teal-200 py-8 px-4 flex flex-col gap-5 font-jetbrains border-black border-r-2 border-t-2 border-b-2 tracking-wide">
        <h1 className='text-3xl font-extrabold uppercase'>Technologies</h1>
        <ul className='font-semibold flex flex-col gap-1'>
          {technologies.map((tech, index) => (
            <li key={index} className="bg-white border-2 border-black p-2 hover:bg-gray-200">✨ {tech}</li>
          ))}
        </ul>
      </div>

      {/* Technologies Images */}
      <div className="bg-pink-300 p-4 border-black border-l-2 border-t-2 border-b-2 flex justify-center items-center">
        <div className="grid grid-cols-3 gap-x-16 gap-y-12">
          {technologiesImages.map((image, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={image}
                alt={image.split('.')[0] || "technologia"}
                className="max-w-full h-24 object-contain border-4 border-black p-2 shadow-lg transform hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Concepts Images */}
      <div className="bg-pink-300 p-4 border-black border-r-2 border-t-2 border-b-2 flex justify-center items-center">
        <div className="grid grid-cols-3 gap-x-16 gap-y-12">
          {conceptsImages.map((image, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={image}
                alt={image.split('.')[0] || "technologia"}
                className="max-w-full h-24 object-contain border-4 border-black p-2 shadow-lg transform hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Concepts List */}
      <div className="bg-teal-200 py-8 px-4 flex flex-col gap-5 font-jetbrains border-black border-l-2 border-t-2 border-b-2">
        <h1 className='text-3xl font-extrabold uppercase'>Concepts</h1>
        <ul className='font-semibold flex flex-col gap-1'>
          {concepts.map((concept, index) => (
            <li key={index} className="bg-white border-2 border-black p-2 hover:bg-gray-200">✨ {concept}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Skills