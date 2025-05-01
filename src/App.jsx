import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ProjectsScene from './scene/ProjectsScene.jsx';
import ExperiencesScene from './scene/ExperiencesScene.jsx';
import Skills from './components/Skills.jsx';
import Contact from './components/Contact.jsx';

export default function App() {
  return (
    <div className="snap-y overflow-y-scroll h-screen">
      <Navbar></Navbar>
      <Hero id="home" className="snap-start"></Hero>
      <ExperiencesScene id="experience" className="snap-start"></ExperiencesScene>
      <ProjectsScene id="projects" className="snap-start"></ProjectsScene>
      <Skills id="skills" className="snap-start"></Skills>
      <Contact id="contact" className="snap-start"></Contact>
    </div>
  );
}