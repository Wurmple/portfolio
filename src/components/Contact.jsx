import React from 'react'

const Contact = ({ id, className }) => {
  return (
    <div id={id} className={`border-black border-t-2 h-[91vh] w-screen bg-lime-200 flex flex-col justify-evenly px-16 py-8 ${className}`}>
      <div className='self-end bg-white border-black border-t-2 border-l-2 border-r-8 border-b-8 pl-12 pr-28 py-4 rounded-lg hover:scale-110 transition-transform duration-200'>
        <h1 className='text-2xl font-extrabold font-k2d'>GET IN TOUCH:</h1>
      </div>
      <div className='self-center bg-white border-black border-t-2 border-l-2 border-r-8 border-b-8 px-6 py-6 rounded-lg flex flex-col gap-6'>
        <a 
          href="mailto:shyampoduval1@gmail.com"
          className='flex flex-row gap-8 group hover:bg-lime-100 rounded-md p-2 transition-colors duration-200'
        >
          <img src="mail.svg" className='h-12 group-hover:scale-110 transition-transform duration-200' alt="email" />
          <h2 className='mt-3 font-k2d text-xl group-hover:text-lime-700 group-hover:underline cursor-pointer'>
            shyampoduval1@gmail.com
          </h2>
        </a>
        <a 
          href="tel:+919323995735"
          className='flex flex-row gap-8 group hover:bg-lime-100 rounded-md p-2 transition-colors duration-200'
        >
          <img src="phone.svg" className='h-12 group-hover:scale-110 transition-transform duration-200' alt="phone number" />
          <h2 className='mt-3 font-k2d text-xl group-hover:text-lime-700 group-hover:underline cursor-pointer'>
            +91 9323995735
          </h2>
        </a>
        <a 
          href="https://www.linkedin.com/in/shyam-poduval-8b3138203/"
          target="_blank"
          rel="noopener noreferrer"
          className='flex flex-row gap-8 group hover:bg-lime-100 rounded-md p-2 transition-colors duration-200'
        >
          <img src="linkedin.svg" className='h-12 group-hover:scale-110 transition-transform duration-200' alt="linkedin" />
          <h2 className='mt-3 font-k2d text-xl group-hover:text-lime-700 group-hover:underline cursor-pointer'>
            linkedin.com/in/shyam-poduval-8b3138203/
          </h2>
        </a>
      </div>
      <a 
        href="/Shyam-Resume.pdf" 
        download="Shyam_Poduval_Resume.pdf"
        className='group self-start bg-green-500 border-black border-t-2 border-l-2 border-r-8 border-b-8 rounded-lg flex flex-row gap-4 px-3 py-6 cursor-pointer hover:bg-green-600 hover:scale-110 transition duration-200'
      >
        <h2 className='font-k2d text-2xl font-extrabold px-2 py-1 group-hover:text-white'>DOWNLOAD MY RESUME</h2>
        <img src='download.svg' className='h-10 mr-4 group-hover:filter group-hover:brightness-0 group-hover:invert' alt='download resume' />
      </a>
    </div>
  )
}

export default Contact