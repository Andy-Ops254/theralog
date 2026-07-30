import React, { useEffect,useState } from 'react'
import{useParams} from 'react-router-dom'

function PatientProfile() {

  const {id} = useParams();
  const [patient, setPatient]=useState('')

  useEffect(() => {
    const token =localStorage.getItem('token')
    if (!token) {
      return ('Not Authorized!')
    }
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
    .catch(err => console.error(err))
  }, [id])

  return (
    <div>PatientProfile</div>
  )
}

export default PatientProfile