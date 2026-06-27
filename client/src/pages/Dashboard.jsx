import React from 'react'

function Dashboard() {

    let username = 'Clinician'

    const clinician = JSON.parse(localStorage.getItem('clinician'))
    if (clinician) {
        username =
            clinician.name ||
            clinician.email ||
            'clinician'
    }
  return (
    <div>
        <div>
            <h1>
                Dasboard
            </h1>
            <h2>
                👋 WELCOME {username}

            </h2>
        </div>
    </div>
  )
}

export default Dashboard