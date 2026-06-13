import React from 'react'

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E7EEF9] py-10">
      <div className="p-6 sm:p-8 max-w-md w-full mx-4 rounded-3xl bg-[#F1F5FB] shadow-[16px_16px_30px_rgba(18,34,62,0.08),-16px_-16px_30px_rgba(255,255,255,0.9)]">
        <div className="space-y-2 text-center">
          <h1 className="font-serif font-bold text-4xl leading-6 tracking-wide text-[#12223E]">THERALOG</h1>
          <p className="font-normal text-xl leading-6 tracking-tight text-[#4A6EA0]">psychology practice management</p>
        </div>

        <div className="mt-8">
          <form className="flex flex-col space-y-4">
            <h2 className="font-semibold text-2xl text-[#12223E] my-6">Welcome!</h2>

            <div className="flex flex-col">
              <label htmlFor="name" className="font-semibold text-sm text-[#12223E] mb-2">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                required
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
                required
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
                required
                className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="font-semibold text-white bg-[#4A6EA0] text-[14px] mt-4 py-2 px-4 w-full h-12 rounded-2xl hover:bg-[#3A5A8A]"
            >
              Sign Up
            </button>
          </form>

          <p className="font-light tracking-wider text-base text-center mt-6">
            Already have an account?
            <button type="button" className="font-medium hover:text-blue-500 px-2 cursor-pointer underline">
              SignIn here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
