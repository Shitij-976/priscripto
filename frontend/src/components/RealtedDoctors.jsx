import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const RealtedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext) // Access the doctors list from the context
    const navigate = useNavigate() // Hook for navigation
    const [relDoc, setRelDocs] = useState([]) // State to store related doctors

    // Fetch related doctors based on the speciality
    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            // Filter doctors with the same speciality but exclude the current doctor
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDocs(doctorsData) // Update the related doctors state
        }
    }, [doctors, speciality, docId]) // Runs when doctors, speciality, or docId change

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
            {/* Section Title */}
            <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
            <p className='sm:w-1/3 text-center text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit.!</p>
            
            {/* Doctors List */}
            <div className='w-full grid grid-cols-auto gap-4 gap-y-6 px-3 sm:px-0'>
                {
                    relDoc.slice(0, 5).map((item, index) => (
                        // Scroll to the top on navigation
                        <div  onClick={() => {  navigate(`/appointment/${item._id}`);  scrollTo(0, 0);  }}  className='border border-blue-200 overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 rounded-xl' key={index}  >
                            {/* Doctor Image */}
                            <img className='bg-blue-50' src={item.image} alt={item.name} />       
                            {/* Doctor Details */}
                            <div className='p-4'>
                                {/* Availability Status */}
                                <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                    <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                                </div>
                                <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                                <p className='text-gray-600 text-sm'>{item.speciality}</p>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* More Doctors Button */}
            <button  onClick={() => {  navigate('/doctors');  scrollTo(0, 0);}}  className='bg-blue-100 text-gray-600 px-12 py-3 rounded-full mt-10'>
                More
            </button>
        </div>
    )
}

export default RealtedDoctors
