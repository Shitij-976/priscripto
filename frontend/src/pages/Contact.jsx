import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
    return (
        <div>
            <div className=' text-center text-2xl pt-10 text-gray-500'>
                <p> CONTACT <span className='text-gray-700 font-medium'>US</span></p>
            </div>
            <div className='flex my-10  flex-col justify-center md:flex-row mb-28 gap-10 text-sm'>
                <img  className='w-full md:w-[360px]'src={assets.contact_image} alt="" />
                <div>
                    <p>OUR OFFICE</p>
                    <p>00000 Willms Station<br/> Suite 000, Washington, USA</p>
                    <p>Tel: (000) 000-0000 <br/>Email: greatstackdev@gmail.com</p>
                    <p>CAREERS AT PRESCRIPTO</p>
                    <p>Learn more about our teams and job openings.</p>
                    <button>Explore Jobs</button>
                </div>
            </div>
        </div>
    )
}

export default Contact
