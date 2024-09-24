import React from 'react'

const HeaderAdmin = ({ titulo }) => {
  return (
    <header className="py-6 bg-login-form shadow-md w-full text-center">
        <p className="text-4xl text-blue-gray-100 carter px-6">
          {titulo}
        </p>
      </header>
  )
}

export default HeaderAdmin
