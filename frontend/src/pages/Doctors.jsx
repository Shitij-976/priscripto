import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

/**
 * Doctors Page Component:
 * - Displays doctor listings with specialty selection on the left
 * - Seamlessly integrates with the Navbar search query to filter doctors
 * - Preserves the original clean layout and styling
 */
const Doctors = () => {
    // Current specialty selected from URL path (e.g. /doctors/:speciality)
    const { speciality } = useParams()
    const [filterDoc, setFilterDoc] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const navigate = useNavigate()

    // Access doctors list and global search text from AppContext
    const { doctors, search } = useContext(AppContext)

    /**
     * Filter doctors based on:
     * 1. Selected specialty (if present)
     * 2. Search query entered from Navbar (matches doctor's name or specialty)
     */
    const applyFilter = () => {
        let docList = doctors || []

        // 1. Filter by specialty from route params
        if (speciality) {
            docList = docList.filter(doc => doc.speciality === speciality)
        }

        // 2. Filter by search query from Navbar
        if (search && search.trim()) {
            const query = search.toLowerCase().trim()
            docList = docList.filter(doc => 
                (doc.name && doc.name.toLowerCase().includes(query)) ||
                (doc.speciality && doc.speciality.toLowerCase().includes(query))
            )
        }

        setFilterDoc(docList)
    }

    // Re-run filter whenever doctors data, selected specialty, or search changes
    useEffect(() => {
        applyFilter()
    }, [doctors, speciality, search])

    return (
        <div>
            {/* Page Header */}
            <p className='text-gray-600'>Browse through the doctors speciality </p>
            
            <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
                {/* Mobile Filter Toggle Button */}
                <button
                    className={`py-1 px-3 items-start border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`}
                    onClick={() => setShowFilter(prev => !prev)}
                >
                    Filters
                </button>

                {/* Left Sidebar Specialty Filters */}
                <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    <p onClick={() => speciality === "General physician" ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}>General physician</p>
                    <p onClick={() => speciality === "Gynecologist" ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>Gynecologist</p>
                    <p onClick={() => speciality === "Dermatologist" ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>Dermatologist</p>
                    <p onClick={() => speciality === "Pediatricians" ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}>Pediatricians</p>
                    <p onClick={() => speciality === "Neurologist" ? navigate('/doctors') : navigate('/doctors/Neurologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""}`}>Neurologist</p>
                    <p onClick={() => speciality === "Gastroenterologist" ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologist</p>
                </div>

                {/* Right Side Doctor Cards Grid */}
                <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                    {
                        filterDoc.length > 0 ?
                            filterDoc.map((item, index) => (
                                <div onClick={() => navigate(`/appointment/${item._id}`)} className='border border-blue-200 overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 rounded-xl ' key={index} >
                                    <img className='bg-blue-50' src={item.image} alt={item.name} />
                                    <div className='p-4'>
                                        {/* Dynamic Availability Status linked with Admin Dashboard */}
                                        <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                                            <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                                            <p>{item.available ? 'Available' : 'Not Available'}</p>
                                        </div>
                                        <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                                        <p className='text-gray-600 text-sm'>{item.speciality}</p>
                                    </div>
                                </div>
                            ))
                            :
                            <p className='text-gray-500 text-center col-span-full'>
                                No doctors available{speciality ? ` for ${speciality}` : ''}. Please select another specialty.
                            </p>
                    }
                </div>
            </div>
        </div>
    )
}

export default Doctors
