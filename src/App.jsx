import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ExperiencesScene from './scene/ExperiencesScene.jsx';
import ProjectsScene from './scene/ProjectsScene.jsx';
import Skills from './components/Skills.jsx';
import Education from './components/Education.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <Hero id="home" />
      <ExperiencesScene id="experience" />
      <ProjectsScene id="projects" />
      <Skills id="skills" />
      <Education id="education" />
      <Contact id="contact" />
    </>
  );
}
