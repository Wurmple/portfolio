import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import ProjectsScene from './scene/ProjectsScene.jsx';
import ExperiencesScene from './scene/ExperiencesScene.jsx';
import Skills from './components/Skills.jsx';
import Contact from './components/Contact.jsx';
import { useEffect } from 'react';

export default function App() {
  useEffect(()=> {
    window.scrollTo({top: 0, behavior: 'smooth'});
  }, []);

  return (
    <div className='snap-y'>
      <Navbar></Navbar>
      <Hero id="home" className="snap-start"></Hero>
      <ExperiencesScene id="experience"></ExperiencesScene>
      <ProjectsScene id="projects"></ProjectsScene>
      <Skills id="skills"></Skills>
      <Contact id="contact"></Contact>
    </div>
  );
}