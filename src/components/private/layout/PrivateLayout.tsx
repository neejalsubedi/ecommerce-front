import React from 'react'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'


const PrivateLayout = () => {
  return (
    <div className='flex  h-screen overflow-hidden'>
      <div className=' bg-white    '>
        <Sidebar/>
        
      </div>
      <main className="flex-1  bg-indigo-200 overflow-hidden">
          <Outlet/>
        </main>
    </div>
  )
}

export default PrivateLayout