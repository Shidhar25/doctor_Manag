import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import PreConsultationForm from '../components/PreConsultationForm'
import axios from 'axios'
import { toast } from 'react-toastify'

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [showPreConsultation, setShowPreConsultation] = useState(false)
    const [consultationResult, setConsultationResult] = useState(null)
    const [recommendedDoctors, setRecommendedDoctors] = useState([])

    const navigate = useNavigate()

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSolts = async () => {

        setDocSlots([])

        // getting current date
        let today = new Date()

        for (let i = 0; i < 7; i++) {

            // getting date with index 
            let currentDate = new Date(today)
            currentDate.setDate(today.getDate() + i)

            // setting end time of the date with index
            let endTime = new Date()
            endTime.setDate(today.getDate() + i)
            endTime.setHours(21, 0, 0, 0)

            // setting hours 
            if (today.getDate() === currentDate.getDate()) {
                currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
            } else {
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }

            let timeSlots = [];


            while (currentDate < endTime) {
                let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                let day = currentDate.getDate()
                let month = currentDate.getMonth() + 1
                let year = currentDate.getFullYear()

                const slotDate = day + "_" + month + "_" + year
                const slotTime = formattedTime

                const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

                if (isSlotAvailable) {

                    // Add slot to array
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime
                    })
                }

                // Increment current time by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setDocSlots(prev => ([...prev, timeSlots]))

        }

    }

    const getSeverityMessage = (severity) => {
        switch (severity) {
            case 'serious':
                return {
                    title: 'Immediate Medical Attention Required',
                    message: 'Based on your symptoms, you need immediate medical attention. This doctor may not be immediately available. We strongly recommend consulting one of our available specialists right away.',
                    waitTime: 'Immediate attention needed',
                    color: 'text-red-600',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200'
                };
            case 'moderate':
                return {
                    title: 'Prompt Medical Attention Recommended',
                    message: 'Your condition requires attention soon. This doctor will be available in approximately 30 minutes, or you can consult other available specialists.',
                    waitTime: '~30 minutes',
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200'
                };
            default:
                return {
                    title: 'Regular Consultation',
                    message: 'Your symptoms appear to be non-urgent. You can proceed with booking an appointment with this doctor or choose from other available specialists.',
                    waitTime: '~1 hour',
                    color: 'text-green-600',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200'
                };
        }
    };

    const findRecommendedDoctors = () => {
        // Filter doctors based on availability and same speciality
        const availableDoctors = doctors.filter(doc => 
            doc._id !== docId && 
            doc.speciality === docInfo.speciality
        );

        setRecommendedDoctors(availableDoctors.slice(0, 3));
    };

    const handlePreConsultation = () => {
        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }
        setShowPreConsultation(true)
    };

    const handleConsultationSubmit = (result) => {
        setConsultationResult(result);
        setShowPreConsultation(false);
        findRecommendedDoctors();
    };

    const bookAppointment = async () => {
        if (!consultationResult) {
            toast.warning('Please complete the pre-consultation assessment first')
            return
        }

        if (!slotTime) {
            toast.warning('Please select an appointment time')
            return
        }

        const date = docSlots[slotIndex][0].datetime

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {
            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', {
                docId,
                slotDate,
                slotTime,
                preConsultation: consultationResult
            }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getDoctosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo])

    return docInfo ? (
        <div>

            {/* ---------- Doctor Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>

                    {/* ----- Doc Info : name, degree, experience ----- */}

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>Appointment fee: <span className='text-gray-800'>{currencySymbol}{docInfo.fees}</span> </p>
                </div>
            </div>

            {/* Pre-consultation Results */}
            {consultationResult && (
                <div className='sm:ml-72 sm:pl-4 mt-8'>
                    <div className={`p-4 rounded-lg border ${getSeverityMessage(consultationResult.severity).borderColor} ${getSeverityMessage(consultationResult.severity).bgColor}`}>
                        <h3 className={`font-semibold ${getSeverityMessage(consultationResult.severity).color}`}>
                            {getSeverityMessage(consultationResult.severity).title}
                        </h3>
                        <p className='text-gray-600 mt-2'>
                            {getSeverityMessage(consultationResult.severity).message}
                        </p>
                        <p className='text-sm font-medium mt-2'>
                            Expected wait time: {getSeverityMessage(consultationResult.severity).waitTime}
                        </p>
                    </div>

                    {recommendedDoctors.length > 0 && (
                        <div className='mt-6'>
                            <h3 className='font-semibold mb-3'>Alternative Available Doctors</h3>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {recommendedDoctors.map(doctor => (
                                    <div 
                                        key={doctor._id}
                                        onClick={() => navigate(`/appointment/${doctor._id}`)}
                                        className='border rounded-lg p-4 cursor-pointer hover:border-blue-500'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <img 
                                                src={doctor.image} 
                                                alt={doctor.name}
                                                className='w-12 h-12 rounded-full object-cover'
                                            />
                                            <div>
                                                <p className='font-medium'>{doctor.name}</p>
                                                <p className='text-sm text-gray-600'>{doctor.speciality}</p>
                                                <p className='text-xs text-blue-600 mt-1'>Next available: {doctor.next_available || 'Check availability'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]'>
                <p >Booking slots</p>
                <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                    {docSlots.length && docSlots.map((item, index) => (
                        <div onClick={() => setSlotIndex(index)} key={index} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-[#DDDDDD]'}`}>
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length && docSlots[slotIndex].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} key={index} className={`text-sm font-light  flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-[#949494] border border-[#B4B4B4]'}`}>{item.time.toLowerCase()}</p>
                    ))}
                </div>

                {!consultationResult ? (
                    <button 
                        onClick={handlePreConsultation}
                        className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6'
                    >
                        Start Pre-Consultation
                    </button>
                ) : (
                    <button 
                        onClick={bookAppointment}
                        className='bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6'
                    >
                        Book Appointment
                    </button>
                )}
            </div>

            {showPreConsultation && (
                <PreConsultationForm
                    onSubmit={handleConsultationSubmit}
                    onClose={() => setShowPreConsultation(false)}
                />
            )}

            {/* Listing Releated Doctors */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : null
}

export default Appointment