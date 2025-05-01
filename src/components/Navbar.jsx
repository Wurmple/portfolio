import React from 'react'

const Navbar = () => {
    const sections = ["home", "experience", "projects", "skills", "contact"];

    const handleSectionClick = (section) => {
        console.log("Selected section:", section);
        // TODO scroll to selected section
        const sectionElement = document.getElementById(section);
        if(sectionElement) {
            sectionElement.scrollIntoView({behavior: 'smooth'});
        }
        else {
            console.warn("Unable to find element with id " + section);
        }
    }

    return (
    <nav className="sticky top-0 border-b-8 border-black bg-white h-[9vh] w-screen z-[1000]">
        <ul className='flex justify-center items-center gap-40 h-full w-full'>
            {sections.map((section) => (
                <li key={section} className='font-k2d font-extrabold text-2xl border-b-4 border-transparent hover:border-black hover:cursor-pointer' onClick={() => handleSectionClick(section)}>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                </li>
            ))}
        </ul>
    </nav>
  )
}

export default Navbar