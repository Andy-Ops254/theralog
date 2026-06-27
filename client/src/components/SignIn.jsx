import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignIn() {

    const navigate = useNavigate()

    const [signin, setSignin]= useState({
        name:"",
        email:"",
        password:""
    })

    function handleChange(e) {
        const{name,value}=e.target
        setSignin({...signin,[name]:value})
    }

    function handleSubmit(e) {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const headers = {
            "Content-Type":"application/json"
        }
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        fetch('http://127.0.0.1:5000/login', {
            method: "POST",
            headers,
            body:JSON.stringify(signin)
        })
        .then(response => {
            console.log(response.status)
            if(!response.ok) {
                throw new Error("SignIn Failed!!")
            }
            return response.json()
        })
        .then(Data => {
            console.log(Data)
            const accessToken = Data?.token || Data?.access_token || Data?.accessToken
            if (accessToken) {
                localStorage.setItem('token', accessToken)

             // save the clinician object too
            const clinician = Data?.clinician || Data?.user || Data?.data
            if (clinician) {
                localStorage.setItem('clinician', JSON.stringify(clinician))
            }
            }
            setSignin ({
                name:"", 
                email:"",
                password:""
            })
            navigate('/layout')
        })
        .catch(error => {
            console.error('SignIn Failed', error.message)
        });
        

    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E7EEF9] py-10">
            <div className="p-6 sm:p-8 max-w-md w-full mx-4 rounded-3xl bg-[#F1F5FB] shadow-[16px_16px_30px_rgba(18,34,62,0.08),-16px_-16px_30px_rgba(255,255,255,0.9)]">
            <div className="space-y-2 text-center">
                <h1 className="font-serif font-bold text-4xl leading-6 tracking-wide text-[#12223E]">THERALOG</h1>
                <p className="font-normal text-sm leading-6 tracking-tight text-[#4A6EA0]">psychology practice management</p>
            </div>

            <div className="mt-8">
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                <button
                    type="button"
                    onClick={() => window.location.href = '/'}
                    className="inline-flex items-center gap-2 text-[#12223E] font-semibold text-sm hover:text-[#0f1b32] transition-colors"
                >
                    ← Back Home
                </button>
                <h2 className="font-semibold text-2xl text-[#12223E] my-6">Welcome Back!</h2>

                <div className="flex flex-col">
                    <label htmlFor="name" className="font-semibold text-sm text-[#12223E] mb-2">Name</label>
                    <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={signin.name}
                    required
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="email" className="font-semibold text-sm text-[#12223E] mb-2">Email</label>
                    <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={signin.email}
                    required
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="font-semibold text-sm text-[#12223E] mb-2">Password</label>
                    <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={signin.password}
                    required
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="font-semibold text-white bg-[#4A6EA0] text-[14px] mt-4 py-2 px-4 w-full h-12 rounded-2xl hover:bg-[#3A5A8A]"
                >
                    Sign In
                </button>
                </form>

                <p className="font-light tracking-wider text-base text-center mt-6">
                Don't have an account?
                <button
                type="button" 
                onClick={() => navigate('/register')}
                className="font-medium hover:text-blue-500 px-2 cursor-pointer underline">
                    Register here
                </button>
                </p>
            </div>
            </div>
        </div>
  )
}



export default SignIn