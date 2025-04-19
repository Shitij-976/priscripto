import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RealtedDoctors from '../components/RealtedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, backendUrl, token,getDoctorsData} = useContext(AppContext);
    const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const navigate = useNavigate()
    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc._id === docId);
        setDocInfo(docInfo);
    };

    const getAvailableSlots = () => {
        setDocSlots([]);
        let today = new Date();
        let allSlots = [];

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            let endTime = new Date(currentDate);
            endTime.setHours(21, 0, 0, 0);

            if (today.getDate() === currentDate.getDate()) {
                if (currentDate.getHours() >= 21) continue;
                currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeslots = [];
            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                timeslots.push({ datetime: new Date(currentDate), time: formattedTime });
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            allSlots.push(timeslots);
        }

        setDocSlots(allSlots);
    };

    const bookAppointment = async () => {
        if (!token) {
            toast.warn("Login to book appointment");
            return navigate("/login");
        }
        if (!slotTime) {
            toast.warn("Please select a slot");
            return;
        }
        try {
            // using the first slot in the selected day's array to create the date string
            const date = docSlots[slotIndex][0].datetime;
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            const slotDate = day + "_" + month + "_" + year;
            const { data } = await axios.post(
                backendUrl + "/api/user/book-appointment",
                { docId, slotDate, slotTime },
                { headers: { token } }
            );
            if (data.success) {
                toast.success(data.message);
                getDoctorsData();
                return navigate("/my-appointment");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchDocInfo();
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) getAvailableSlots();
    }, [docInfo]);

    useEffect(() => {

        console.log('Generated Slots:', docSlots);
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
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                            About <img src={assets.info_icon} alt="" />
                        </p>
                        <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>
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
                                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`}
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
                        docSlots.length > 0 && docSlots[slotIndex] ? docSlots[slotIndex].map((item, index) => (
                            <p
                                onClick={() => setSlotTime(item.time)}
                                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`}
                                key={index}
                            >
                                {item.time.toLowerCase()}
                            </p>
                        )) : <p className="text-gray-500">No slots available for this day.</p>
                    }
                </div>
                <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
                    Book an Appointment
                </button>
            </div>

            {/* Related Doctors Section */}
            <RealtedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
    );
};

export default Appointment;
