import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { FiSearch, FiX, FiFilter } from 'react-icons/fi'

/**
 * Doctors Page Component:
 * - Lists doctors with search and specialty filtering capabilities
 * - Supports Specialty filter (URL /doctors/:speciality), global keyword search, and availability toggle
 * - Displays active filter chips with 1-click removal & reset
 * - Handles empty states and dynamic availability badges
 */
const Doctors = () => {
    // Read route parameter for current specialty
    const { speciality } = useParams()

    // Local component state
    const [filterDoc, setFilterDoc] = useState([])
    const [showFilter, setShowFilter] = useState(false)
    const [availableOnly, setAvailableOnly] = useState(false)
    const navigate = useNavigate()

    // Consume global application context
    const { doctors, currencySymbol, search, setSearch } = useContext(AppContext)

    // Pre-defined list of supported medical specialties
    const specialtiesList = [
        "General physician",
        "Gynecologist",
        "Dermatologist",
        "Pediatricians",
        "Neurologist",
        "Gastroenterologist"
    ]

    /**
     * Unified Filtering Pipeline:
     * 1. Filters by specialty (if URL parameter is provided)
     * 2. Filters by keyword search (matches name, specialty, degree, about bio, address)
     * 3. Filters by availability flag (if 'Available Only' toggle is enabled)
     */
    const applyFilter = () => {
        let result = doctors ? [...doctors] : []

        // Step 1: Specialty Filter (case-insensitive)
        if (speciality) {
            result = result.filter(doc => 
                doc.speciality && doc.speciality.toLowerCase() === speciality.toLowerCase()
            )
        }

        // Step 2: Global Search Filter across multiple fields
        if (search && search.trim()) {
            const query = search.toLowerCase().trim()
            result = result.filter(doc => {
                const nameMatch = doc.name && doc.name.toLowerCase().includes(query)
                const specMatch = doc.speciality && doc.speciality.toLowerCase().includes(query)
                const degreeMatch = doc.degree && doc.degree.toLowerCase().includes(query)
                const aboutMatch = doc.about && doc.about.toLowerCase().includes(query)
                const addressMatch = 
                    (doc.address?.line1 && doc.address.line1.toLowerCase().includes(query)) ||
                    (doc.address?.line2 && doc.address.line2.toLowerCase().includes(query))
                return nameMatch || specMatch || degreeMatch || aboutMatch || addressMatch
            })
        }

        // Step 3: Availability Filter
        if (availableOnly) {
            result = result.filter(doc => doc.available === true)
        }

        // Update filtered results
        setFilterDoc(result)
    }

    // Re-run filter pipeline whenever doctors list, specialty, search, or availability changes
    useEffect(() => {
        applyFilter()
    }, [doctors, speciality, search, availableOnly])

    /**
     * Clear all active filters and return to default state
     */
    const resetAllFilters = () => {
        setSearch('')
        setAvailableOnly(false)
        navigate('/doctors')
    }

    // Check if any filter or search query is currently active
    const hasActiveFilters = Boolean(speciality || search.trim() || availableOnly)

    return (
        <div className='pb-10'>
            {/* Header info & Mobile Filter Button */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                <div>
                    <h1 className='text-xl sm:text-2xl font-semibold text-gray-800'>Find Doctors</h1>
                    <p className='text-gray-500 text-sm mt-0.5'>Browse through our experienced doctors and specialists.</p>
                </div>

                {/* Mobile Filter Toggle Button */}
                <button
                    className={`sm:hidden py-1.5 px-3 self-start flex items-center gap-1.5 border rounded-lg text-xs font-medium transition-all ${
                        showFilter ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'
                    }`}
                    onClick={() => setShowFilter(prev => !prev)}
                >
                    <FiFilter /> Filters
                </button>
            </div>

            {/* Active Filter Tags / Chips Bar */}
            {hasActiveFilters && (
                <div className='flex flex-wrap items-center gap-2 mt-4 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100'>
                    <span className='text-xs font-medium text-gray-600'>Active Filters:</span>
                    
                    {/* Active Specialty Chip */}
                    {speciality && (
                        <span className='inline-flex items-center gap-1.5 bg-white text-primary border border-primary/30 text-xs px-2.5 py-1 rounded-full shadow-sm'>
                            Specialty: <strong className='font-semibold'>{speciality}</strong>
                            <button onClick={() => navigate('/doctors')} className='hover:text-red-500' aria-label="Remove specialty filter">
                                <FiX className='text-xs' />
                            </button>
                        </span>
                    )}

                    {/* Active Search Term Chip */}
                    {search.trim() && (
                        <span className='inline-flex items-center gap-1.5 bg-white text-primary border border-primary/30 text-xs px-2.5 py-1 rounded-full shadow-sm'>
                            Search: <strong className='font-semibold'>"{search}"</strong>
                            <button onClick={() => setSearch('')} className='hover:text-red-500' aria-label="Clear search">
                                <FiX className='text-xs' />
                            </button>
                        </span>
                    )}

                    {/* Active Availability Filter Chip */}
                    {availableOnly && (
                        <span className='inline-flex items-center gap-1.5 bg-white text-green-700 border border-green-300 text-xs px-2.5 py-1 rounded-full shadow-sm'>
                            Available Only
                            <button onClick={() => setAvailableOnly(false)} className='hover:text-red-500' aria-label="Clear availability filter">
                                <FiX className='text-xs' />
                            </button>
                        </span>
                    )}

                    {/* Quick Clear All Button */}
                    <button 
                        onClick={resetAllFilters} 
                        className='text-xs text-red-600 hover:text-red-800 underline ml-auto font-medium transition'
                    >
                        Clear All
                    </button>
                </div>
            )}

            {/* Total Doctor Count Display */}
            <div className='flex justify-between items-center text-xs text-gray-500 mt-4 mb-2'>
                <span>Showing <strong className='text-gray-800 font-semibold'>{filterDoc.length}</strong> {filterDoc.length === 1 ? 'doctor' : 'doctors'}</span>
            </div>

            {/* Main Content: Left Filter Sidebar + Right Doctor Cards Grid */}
            <div className='flex flex-col sm:flex-row items-start gap-6 mt-2'>
                {/* Left Sidebar Filter Section */}
                <div className={`w-full sm:w-64 flex-shrink-0 flex flex-col gap-5 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
                    {/* Specialty Categories List */}
                    <div className='bg-white sm:border border-gray-200 rounded-xl sm:p-4'>
                        <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>Specialties</p>
                        <div className='flex flex-col gap-2 text-sm text-gray-600'>
                            {/* "All Specialties" Option for easy reset */}
                            <p
                                onClick={() => navigate('/doctors')}
                                className={`w-full px-3 py-2 rounded-lg cursor-pointer transition-all border ${
                                    !speciality 
                                        ? "bg-primary text-white border-primary shadow-sm font-medium" 
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                All Specialties
                            </p>

                            {/* Dynamic Specialty Item Buttons */}
                            {specialtiesList.map((item, index) => {
                                const isActive = speciality && speciality.toLowerCase() === item.toLowerCase()
                                return (
                                    <p
                                        key={index}
                                        onClick={() => isActive ? navigate('/doctors') : navigate(`/doctors/${item}`)}
                                        className={`w-full px-3 py-2 rounded-lg cursor-pointer transition-all border ${
                                            isActive
                                                ? "bg-primary text-white border-primary shadow-sm font-medium"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        {item}
                                    </p>
                                )
                            })}
                        </div>
                    </div>

                    {/* Secondary Filters (Availability Toggle) */}
                    <div className='bg-white sm:border border-gray-200 rounded-xl sm:p-4'>
                        <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3'>Availability</p>
                        <label className='flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer select-none'>
                            <input 
                                type="checkbox"
                                checked={availableOnly}
                                onChange={(e) => setAvailableOnly(e.target.checked)}
                                className='w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary accent-primary cursor-pointer'
                            />
                            <span>Available Only</span>
                        </label>
                    </div>
                </div>

                {/* Right Doctor Cards Grid */}
                <div className='w-full'>
                    {filterDoc.length > 0 ? (
                        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
                            {filterDoc.map((item, index) => (
                                <div 
                                    onClick={() => navigate(`/appointment/${item._id}`)} 
                                    className='border border-blue-200 overflow-hidden cursor-pointer hover:translate-y-[-6px] hover:shadow-md transition-all duration-300 rounded-xl bg-white flex flex-col justify-between' 
                                    key={index} 
                                >
                                    <div>
                                        {/* Doctor Image Container */}
                                        <div className='bg-blue-50/60 overflow-hidden'>
                                            <img 
                                                className='w-full h-48 object-cover object-top hover:scale-105 transition duration-500' 
                                                src={item.image} 
                                                alt={item.name} 
                                            />
                                        </div>
                                        <div className='p-4 pb-2'>
                                            {/* Live Doctor Availability Badge */}
                                            <div className={`flex items-center gap-2 text-xs font-medium mb-1.5 ${item.available ? 'text-green-600' : 'text-gray-400'}`}>
                                                <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                                <span>{item.available ? 'Available' : 'Unavailable'}</span>
                                            </div>

                                            {/* Doctor Name & Specialty */}
                                            <p className='text-gray-900 text-base font-semibold truncate' title={item.name}>{item.name}</p>
                                            <p className='text-gray-500 text-sm'>{item.speciality}</p>
                                            
                                            {/* Doctor Experience */}
                                            {item.experience && (
                                                <p className='text-xs text-gray-400 mt-1'>{item.experience} experience</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Consultation Fee & Booking CTA */}
                                    <div className='px-4 pb-4 pt-2 border-t border-gray-100 flex items-center justify-between mt-2'>
                                        <div>
                                            <span className='text-xs text-gray-400'>Consultation</span>
                                            <p className='text-sm font-semibold text-gray-800'>{currencySymbol}{item.fees}</p>
                                        </div>
                                        <button 
                                            className='text-xs text-primary font-medium hover:underline'
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                navigate(`/appointment/${item._id}`)
                                            }}
                                        >
                                            Book Slot &rarr;
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State Display when no doctors match filters */
                        <div className='w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300'>
                            <div className='w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-primary text-2xl mb-4'>
                                <FiSearch />
                            </div>
                            <h3 className='text-lg font-medium text-gray-800 mb-1'>No Doctors Found</h3>
                            <p className='text-gray-500 text-sm max-w-md mb-6'>
                                {search 
                                    ? `No results matched "${search}". Try checking for spelling errors or searching another specialty.`
                                    : "No doctors match the selected filters. Please adjust your criteria or clear filters."}
                            </p>
                            <button 
                                onClick={resetAllFilters}
                                className='px-5 py-2 bg-primary hover:bg-[#4b5bdb] text-white rounded-full text-sm font-medium transition shadow-sm'
                            >
                                Reset All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Doctors
