import React, { useEffect,useState } from 'react'
import{useParams} from 'react-router-dom'

function PatientProfile() {

  const {id} = useParams();
  const [patient, setPatient]=useState(null)
  const [loading, setLoading]=useState(false)
  const [error, setError]=useState(null)



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

  console.log("patient state:", patient)

  return (
    <div>
      <button>
        Back to patients
      </button>

        {loading && <p>Loading patient…</p>}
      {error && <p>{error}</p>}

    {!loading && !error && patient && (
      <div>
        <aside>
          {patient && (
          <div>
            {getInitials(patient.full_name)}
            </div>)}

            {patient&& (
            <h2>
              {patient.full_name}
            </h2>
            )}

            <span>
              {patient.status}
            </span>

            <div>
              <dl>
                <div>
                  <dt>Condition</dt>
                  <dd>{patient.condition}</dd>
                </div>

                <div>
                  <dt>Date Of Birth</dt>
                  <dd>{patient.date_of_birth}</dd>
                </div>

                <div>
                  <dt>Sex</dt>
                  <dd>{patient.sex}</dd>
                </div>

                <div>
                  <dt>Admitted</dt>
                  <dd>{patient.date_of_admission}</dd>
                </div>

                <div>
                  <dt>Patient ID</dt>
                  <dd>{patient.id}</dd>
                </div>
              </dl>
            </div>
        </aside>


        <section>
          <div>
            <h3>Session notes</h3>
            <button>+ ADD NOTES</button>
          </div>
        </section>

        <div>
        {patient && (
          <p>No session notes yet for {patient.full_name.split(" ")[0]}.</p>
        )}
          <p>
            Notes from future sessions will appear here.
          </p>
        </div>
      </div>
    )}
    </div>
  )
}

export default PatientProfile