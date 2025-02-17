import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div className='md:mx-10'>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
                {/* left side */}
                <div>
                    <img className='mb-5 w-40' src={assets.logo} alt="" />
                    <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit rerum laboriosam iusto fuga ipsam praesentium quisquam nihil architecto itaque delectus tenetur nobis quidem provident.</p>
                </div>
                {/* center side */}
                <div >
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>HOME</li>
                        <li>ABOUT US</li>
                        <li> CONTACT US</li>
                        <li>PRIVACY POLICY</li>
                    </ul>
                </div>
                {/* right side */}
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li>+91 1234567890</li>
                        <li>ABC@gmail.com</li>
                    </ul>
                </div>
            </div>
            {/* copy-right */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright2025@ Priscripto - All Right Reserved</p>
            </div>
        </div>
    )
}

export default Footer
