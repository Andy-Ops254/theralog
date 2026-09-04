import React, { useEffect,useState } from 'react'
import{Navigate, useParams} from 'react-router-dom'
import {ArrowLeft,Loader} from "lucide-react"
import { useNavigate } from 'react-router-dom';

function PatientProfile() {

  const {id} = useParams();
  const [patient, setPatient]=useState(null)
  const [loading, setLoading]=useState(false)
  const [error, setError]=useState(null)

const navigate=useNavigate()

  useEffect(() => {
    const token =localStorage.getItem('token')
    if (!token) {
      setError('Not Authorized!')
      setLoading(false);
      return;
    }

    setLoading(true)
    setError(null)

    fetch(`http://127.0.0.1:5000/patient/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
      console.log(res.status)
      if (!res.ok) {
        throw new Error("Failed fetch!!!")
      }
      return res.json()
    }) 
    .then(data => {
      console.log(data)
      setPatient(data)
    })
    .catch(err => setError(err.msg))
    .finally(() => setLoading(false));
  }, [id])


  function getInitials(fullname = ""){
    return fullname
    .split(" ")
    .filter(Boolean)
    .slice(0,2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  }

  // console.log("patient state:", patient)

  function statusStyles(status) {
    const normalizedStatus = String(status || '').trim().toLowerCase();

    switch (normalizedStatus) {
      case 'pending':
        return { bg: 'rgba(230,177,58,0.15)', text: '#E6B13A' };
      case 'active':
        return { bg: 'rgba(75,181,127,0.15)', text: '#4BB57F' };
      case 'discharged':
        return { bg: 'rgba(148,163,184,0.15)', text: '#94A3B8' };
      case 'complete':
        return { bg: 'rgba(75,181,127,0.15)', text: '#4BB57F' };
      case 'incomplete':
        return { bg: 'rgba(230,177,58,0.15)', text: '#E6B13A' };
      default:
        return { bg: 'rgba(148,163,184,0.15)', text: '#94A3B8' };
    }
  }

  const patientStatusStyle = patient ? statusStyles(patient.status) : { bg: 'rgba(148,163,184,0.15)', text: '#94A3B8' };

  return (
    <div className=''>
      <button 
      onClick={(e)=> navigate('/patients')}
      className='inline-flex items-center gap-2 bg-transparent border-none text-[14px] font-medium cursor-pointer px-2 py-1 mb-6 text-[#4A6EA0] hover:scale-105'>
        <ArrowLeft  className='w-4 h-4'/>
        Back to patients
      </button>

        {loading && 
        <p className='items-center font-semibold text-3xl'>
          <Loader  className='w-6 h-6 animate-spin transition-all duration-200'/>
          Loading patient…
        </p>}
      {error && 
      <p className='font-bold text-4xl items-center'>
        {error}
      </p>}

    {!loading && !error && patient && (
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 items-start'>
        <aside className='rounded-3xl px-7 py-6 flex flex-col items-center text-center gap-3 bg-gray-300/50'>
          {patient && (
          <div className='rounded-full bg-[linear-gradient(145deg,#4A6EA0,#35507A)] w-20 h-20 flex items-center justify-center text-3xl font-black text-[#fff]'>
            {getInitials(patient.full_name)}
            </div>)}

            {patient&& (
            <h2 className='text-[18px] font-semibold text-[#4A6EA0]'>
              {patient.full_name}
            </h2>
            )}

            <span
              className='inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide'
              style={{
                backgroundColor: patientStatusStyle.bg,
                color: patientStatusStyle.text,
              }}
            >
              {patient.status}
            </span>

            <div className='w-full h-0.5 bg-gray-300 mx-5 my-4'/>

            <div className= 'w-full'>
              <dl className='w-full m-0'>
                <div className='flex justify-between px-2 py-0 border-b-2 border-gray-300'>
                  <dt className='text-[13px] text-gray-500 m-0'>Condition</dt>
                  <dd className='text-[13px] text-gray-800 font-medium m-0 text-right'>{patient.condition}</dd>
                </div>

                <div className='flex justify-between px-2 py-0 border-b-2 border-gray-300'>
                  <dt className='text-[13px] text-gray-500 m-0'>Date Of Birth</dt>
                  <dd className='text-[13px] text-gray-800 font-medium m-0 text-right'>{patient.date_of_birth}</dd>
                </div>

                <div className='flex justify-between px-2 py-0 border-b-2 border-gray-300'>
                  <dt className='text-[13px] text-gray-500 m-0'>Sex</dt>
                  <dd className='text-[13px] text-gray-800 font-medium m-0 text-right'>{patient.sex}</dd>
                </div>

                <div className='flex justify-between px-2 py-0 border-b-2 border-gray-300'>
                  <dt className='text-[13px] text-gray-500 m-0'>Admitted</dt>
                  <dd className='text-[13px] text-gray-800 font-medium m-0 text-right'>{patient.date_of_admission}</dd>
                </div>

                <div className='flex justify-between px-2 py-0 border-b-2 border-gray-300'>
                  <dt className='text-[13px] text-gray-500 m-0'>Patient ID</dt>
                  <dd className='text-[13px] text-gray-800 font-medium m-0 text-right'>{patient.patient_id}</dd>
                </div>
              </dl>
            </div>
        </aside>


        <section className='rounded-3xl p-7 min-h-105 bg-gray-300/50'>
          <div className='flex justify-between items-center mb-5'>
            <h3 className='text-lg font-semibold m-0 text-[#4A6EA0]'>Session notes</h3>
            <button className='bg-[#4A6EA0] text-white border-none rounded-lg px-2 py-4 text-[13px] font-medium cursor-pointer hover:scale-105'>
              + ADD NOTES
            </button>
          </div>

        <div className='flex flex-col items-center justify-center h-80 rounded-2xl'>
        {patient && (
          <p className='text-[14px] text-gray-400 m-0 '>
            No session notes yet for {patient.full_name.split(" ")[0]}.
          </p>
        )}
          <p className='text-[13px] text-gray-400 m-0'> 
            Notes from future sessions will appear here.
          </p>
        </div>
          </section>

      </div>
    )}
    </div>
  )
}

export default PatientProfile