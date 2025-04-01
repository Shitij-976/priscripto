import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
 import RealtedDoctors from '../components/RealtedDoctors'

const Appointment = () => {
    const { docId } = useParams()
    const { doctors, currencySymbol } = useContext(AppContext)
    const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(null)
    const [docSlots, setDocSlots] = useState([])
    const [SlotIndex, setSlotIndex] = useState(0)
    const [SlotTime, setSlotTime] = useState('')

    // Fetch doctor information based on docId
    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc._id === docId)
        setDocInfo(docInfo)
    }

    // Generate available slots for the next 7 days
    const getAvailableSlots = () => {
        setDocSlots([]) // Reset slots before populating new ones

        let today = new Date()
        let allSlots = [] // Temporary array to store slots before updating state

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            let endTime = new Date(currentDate)
            endTime.setHours(21, 0, 0, 0) // Setting end time to 9:00 PM

            // Adjust starting time based on the current time
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeslots = []
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                timeslots.push({
                    datetime: new Date(currentDate),
                    time: formattedTime
                })

                currentDate.setMinutes(currentDate.getMinutes() + 30) // Increment by 30 minutes
            }

            allSlots.push(timeslots)
        }

        setDocSlots(allSlots) // Update state after all slots are generated
    }

    // Fetch doctor info when component mounts or when docId/doctors change
    useEffect(() => {
        fetchDocInfo()
    }, [doctors, docId])

    // Generate available slots only when docInfo is available
    useEffect(() => {
        if (docInfo) getAvailableSlots()
    }, [docInfo])

    // Log the available slots whenever they update (for debugging)
    useEffect(() => {
        console.log(docSlots);
    }, [docSlots]);

    return docInfo && (
        <div>
            {/* Doctor Details Section */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt={docInfo.name} />
                </div>
                <div className='flex-1 bg-blue-50 rounded-lg p-8 py-7 mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
                        {docInfo.name}
                        <img className='w-5' src={assets.verified_icon} alt="" />
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>
                    {/* About Doctor */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            About <img src={assets.info_icon} alt="" />
                        </p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>
                    {/* Appointment Fee */}
                    <p className='mt-6'>
                        Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
                    </p>
                </div>
            </div>

            {/* Slot Booking Section */}
            <div className='sm:ml-72 sm:pl-4 font-medium text-gray-700 mt-4'>
                <p>Booking Slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {
                        docSlots.length > 0 && docSlots.map((item, index) => (
                            <div 
                                onClick={() => setSlotIndex(index)} 
                                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${SlotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} 
                                key={index}
                            >
                                <p>{item[0] && dayOfWeek[item[0].datetime.getDay()]}</p>
                                <p>{item[0] && item[0].datetime.getDate()}</p>
                            </div>
                        ))
                    }
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {
                        docSlots.length > 0 && docSlots[SlotIndex] ? docSlots[SlotIndex].map((item, index) => (
                            <p 
                                onClick={() => setSlotTime(item.time)} 
                                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === SlotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} 
                                key={index}
                            >
                                {item.time.toLowerCase()}
                            </p>
                        )) : null
                    }
                </div>
                
                {/* Book Appointment Button */}
                <button className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
                    Book an Appointment
                </button>
            </div>

            {/* Related Doctors Section */}
            <RealtedDoctors docId={docId} speciality={docInfo.speciality} /> 
        </div>
    )
}

export default Appointment
