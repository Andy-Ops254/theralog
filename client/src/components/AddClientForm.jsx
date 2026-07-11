import React, { useState } from 'react'

function AddClientForm() {
    const[newClient, setNewClient]=useState({
        name: '',
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
        fetch('http://127.0.0.1:5000', {
            method: 'POST',
            headers:{
                "Content-Type": "application.json",
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
                name: '',
                date_of_birth:'',
                sex: '',
                condition:"",
                assigned_to: '',
                status: '',
                date_of_admission:''
            })
        })
        .catch(err => {
            console.error("Failed !", err.message)
        })
    }
  return (
    <div>
        <div>
            <h2>
                Add New Client
            </h2>
            <p>
                Fill in the details below to Admit your New Client
            </p>
        </div>
        <form onSubmit={handleSubmit}>
            <h2>
                Personal Information
            </h2>
            <label htmlFor="Name">
            <input
            id='name'
            type="text"
            name='name'
            value={newClient.name}
            onChange={handleChange}
            placeholder='e.g Andrew Rimongi'
            />
            Full Name
            </label>

            <label htmlFor="">
            <input
            id='DOB'
            type="date"
            name='DOB'
            value={newClient.date_of_birth}
            placeholder='date_of_birth'
            onChange={handleChange}
            />
            Date of Birth
            </label>

            <label>
            <input
            id='sex-female'
            type="radio"
            name='sex'
            value="female"
            onChange={handleChange}
            /> Female
            </label>
            <br />

            <label>
            <input
            id='sex-male'
            type="radio"
            name='sex'
            value="male"
            /> Male 
            </label>
            <br />

            <label>
            <input
            id='sex-other'
            type="radio"
            name='sex'
            value="other"
            /> other
            </label>
            <br />

            <div>
                <h2>
                    Clinical details
                </h2>
            <label>
            <input
            id='condition'
            type="text"
            name='condition'
            placeholder='e.g Schizophrenia'
            value={newClient.condtion}
            onChange={handleChange}
            />
            Condition/diagnosis
            </label>

            <label htmlFor="">
            <input
            id='Assigned_to'
            type="text"
            name='Assigned_to'
            placeholder='e.g Dr. Andrew Rimongi'
            value={newClient.assigned_to}
            onChange={handleChange}
            />
            Assigned psychologist
            </label>


            <h2>
                    Status
                </h2>
            <div className='flex gap-3'>
                <label>
                <input
                id='status-complete'
                type="radio"
                name='status'
                value="complete"
                onChange={handleChange}
                />
                Complete
                </label> <br />

                <label>
                <input
                id='status-incomplete'
                type="radio"
                name='status'
                onChange={handleChange}
                value="incomplete"
                /> InComplete
                </label>
                <br />

                <label>
                <input
                id='status-pending'
                type="radio"
                name='status'
                onChange={handleChange}
                value="pending"
                /> pending
                </label>
                <br />
            </div>

            <label htmlFor="">
            <input
            id='DOA'
            type="date"
            name='date_of_admission'
            placeholder='Date_of_Admission'
            value={newClient.date_of_admission}
            onChange={handleChange}
            />
            Date of Admission
            </label>

            </div>

            <div>
                <button
                type='submit'>
                    Admit client
                </button>

                <button type='delete'>
                    Cancel
                </button>
            </div>
        </form>
    </div>
  )
}

export default AddClientForm