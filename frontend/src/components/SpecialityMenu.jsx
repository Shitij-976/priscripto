import React from 'react'
import {specialityData} from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <div className='flex flex-col items-center gap-4 py-16 text-gray-800'id='#speciality'>
            <h1 className='font-medium text-4xl'>Find by Speciality</h1>
            <p  className='sm:w-1/3 text-center text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, officia eius amet, t eligendi itaque.</p>
            <div className=' flex sm:justify-center gap-5 w-full overflow-scroll py-5'>
                {
                    specialityData.map((item, index) => (
                        <Link onClick={()=>scrollTo(0,0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/doctors/${item.speciality}`}>
                            <img className='w-16 sm:w-24 mb-2' src={item.image} alt={item.name} />
                            <p>{item.speciality}</p>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default SpecialityMenu
