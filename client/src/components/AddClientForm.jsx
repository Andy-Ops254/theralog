import React, { useState , useEffect} from 'react'
import {jwtDecode} from 'jwt-decode'

function AddClientForm({onCloseModal, isModalOpen}) {
    const[newClient, setNewClient]=useState({
        full_name: '',
        date_of_birth:'',
        sex: '',
        condition:"",
        assigned_to: '',
        status: '',
        date_of_admission:''
    })

    function handleChange(e){
        const {name,value}=e.target
        setNewClient({...newClient, [name]:value})
    }

    function handleSubmit(e){
        e.preventDefault()
        fetch('http://127.0.0.1:5000/new_patient', {
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newClient)
        })
        .then (res => {
            console.log(res.status)
            if (!res.ok) {
                throw new Error ("Admission failed!")
            }
            else{
                return res.json()
            }
        })
        .then (data => {
            console.log(data)
            setNewClient({
                full_name: '',
                date_of_birth:'',
                sex: '',
                condition:"",
                assigned_to: '',
                status: '',
                date_of_admission:''
            })
            onCloseModal()
        })
        .catch(err => {
            console.error("Failed !", err.message)
        })

    }

    function handleCancel(){
        // console.log('finya')
        onCloseModal()
    }

    // inside your component
    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : null;

    useEffect(() => {
    if (isModalOpen) {
        setNewClient(prev => ({
            ...prev,
            assigned_to: user?.name || '',
        }));
    }
}, [isModalOpen]);
  return (
    <div className='rounded-[28px] border border-white/50 bg-white/45 backdrop-blur-md shadow-[16px_16px_40px_rgba(15,23,42,0.10),-16px_-16px_40px_rgba(255,255,255,0.85)] p-8'>
        <div>
            <h2 className='text-[#12223E] text-2xl font-semibold'>
                Add New Client
            </h2>
            <p className='text-[#12223E]/60 mt-1 mb-6'>
                Fill in the details below to Admit your New Client
            </p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-8'>

            <h2 className='text-[#12223E] text-lg font-semibold mb-4'>
                Personal Information
            </h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <label htmlFor="full_name" className='flex flex-col text-sm text-[#12223E] font-medium'>
                    Full Name
                <input
                id='full_name'
                type="text"
                name='full_name'
                value={newClient.full_name}
                onChange={handleChange}
                placeholder='e.g Andrew Rimongi'
                className='mt-2 rounded-2xl bg-white/60 border border-white/60 px-4 py-3
                        text-[#12223E] placeholder:text-slate-400
                        shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)]
                        focus:outline-none focus:ring-2 focus:ring-[#12223E]/20 transition'
                />
                </label>

                <label htmlFor="DOB " className='flex flex-col text-sm text-[#12223E] font-medium'>
                    Date of Birth

                <input
                id='DOB'
                type="date"
                name='date_of_birth'
                value={newClient.date_of_birth}
                placeholder='date_of_birth'
                onChange={handleChange}
                className='mt-2 rounded-2xl bg-white/60 border border-white/60 px-4 py-3
                    text-[#12223E]
                    shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)]
                    focus:outline-none focus:ring-2 focus:ring-[#12223E]/20 transition'
                />
                </label>

                <div className='mt-6'>
                    <h2 className='text-[#12223E] text-lg font-semibold mb-3'>
                        Gender
                    </h2>
                    <div className='flex flex-wrap gap-6'>
                    
                        <label className='flex items-center gap-2 text-[#12223E] text-sm'>
                        <input
                        id='sex-female'
                        type="radio"
                        name='sex'
                        value="female"
                        onChange={handleChange}
                        className='accent-[#12223E]'
                        /> Female
                        </label>
                        <br />

                        <label className='flex items-center gap-2 text-[#12223E] text-sm'>
                        <input
                        id='sex-male'
                        type="radio"
                        name='sex'
                        value="male"
                        className='accent-[#12223E]'
                        /> Male 
                        </label>
                        <br />

                        <label className='flex items-center gap-2 text-[#12223E] text-sm'>
                        <input
                        id='sex-other'
                        type="radio"
                        name='sex'
                        value="other"
                        className='accent-[#12223E]'
                        /> other
                        </label>
                        <br />
            </div>
            </div>
            </div>

            <div>
                <h2 className='text-[#12223E] text-lg font-semibold mb-4'>
                    Clinical details
                </h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
                <label className='flex flex-col text-sm text-[#12223E] font-medium'>
                    Condition/diagnosis
                <input
                id='condition'
                type="text"
                name='condition'
                placeholder='e.g Schizophrenia'
                value={newClient.condtion}
                onChange={handleChange}
                className='mt-2 rounded-2xl bg-white/60 border border-white/60 px-4 py-3
                        text-[#12223E] placeholder:text-slate-400
                        shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)]
                        focus:outline-none focus:ring-2 focus:ring-[#12223E]/20 transition'
                />
                </label>

                <label htmlFor="" className='flex flex-col text-sm text-[#12223E] font-medium'>
                    Assigned psychologist
                <input
                id='Assigned_to'
                type="text"
                name='assigned_to'
                placeholder='e.g Dr. Andrew Rimongi'
                value={newClient.assigned_to}
                readOnly
                className='mt-2 rounded-2xl bg-white/60 border border-white/60 px-4 py-3
                        text-[#12223E] placeholder:text-slate-400 cursor-not-allowed
                        shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)]
                        focus:outline-none focus:ring-2 focus:ring-[#12223E]/20 transition'
                />
                </label>
            </div>

            <h2 className='text-[#12223E] text-lg font-semibold mt-6 mb-3'>
                    Status
                </h2>
            <div className='flex gap-6'>
                <label className='flex items-center gap-2 text-[#12223E] text-sm'>
                    Complete
                <input
                id='status-complete'
                type="radio"
                name='status'
                value="complete"
                onChange={handleChange}
                className='accent-[#12223E]'
                />
                </label> <br />

                <label className='flex items-center gap-2 text-[#12223E] text-sm'>
                    Incomplete
                <input
                id='status-incomplete'
                type="radio"
                name='status'
                onChange={handleChange}
                value="incomplete"
                className='accent-[#12223E]'
                />
                </label>
                <br />

                <label className='flex items-center gap-2 text-[#12223E] text-sm'>
                    pending
                <input
                id='status-pending'
                type="radio"
                name='status'
                onChange={handleChange}
                value="pending"
                className='accent-[#12223E]'
                /> 
                </label>
                <br />
            </div>

            <label htmlFor="DOA" className='flex flex-col text-sm text-[#12223E] font-medium mt-5 max-w-xs'>
                Date of Admission
            <input
            id='DOA'
            type="date"
            name='date_of_admission'
            placeholder='Date_of_Admission'
            value={newClient.date_of_admission}
            onChange={handleChange}
            className='mt-2 rounded-2xl bg-white/60 border border-white/60 px-4 py-3
                    text-[#12223E]
                    shadow-[inset_6px_6px_14px_rgba(15,23,42,0.08),inset_-6px_-6px_14px_rgba(255,255,255,0.8)]
                    focus:outline-none focus:ring-2 focus:ring-[#12223E]/20 transition'
            />
            </label>

            </div>

            <div className='flex gap-4 pt-2'>
                <button
                type='submit'
                className='rounded-2xl px-6 py-3 font-medium text-[#12223E] bg-white/60 border border-white/60
                shadow-[6px_6px_16px_rgba(15,23,42,0.12),-6px_-6px_16px_rgba(255,255,255,0.85)]
                active:shadow-[inset_4px_4px_10px_rgba(15,23,42,0.15),inset_-4px_-4px_10px_rgba(255,255,255,0.8)]
                transition'
                >
                    Admit client
                </button>

                <button 
                type='button'
                onClick={handleCancel}
                className='rounded-2xl px-6 py-3 font-medium text-slate-500 bg-white/40 border border-white/50
                shadow-[6px_6px_16px_rgba(15,23,42,0.08),-6px_-6px_16px_rgba(255,255,255,0.8)]
                active:shadow-[inset_4px_4px_10px_rgba(15,23,42,0.12),inset_-4px_-4px_10px_rgba(255,255,255,0.75)]
                transition'
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
  )
}

export default AddClientForm