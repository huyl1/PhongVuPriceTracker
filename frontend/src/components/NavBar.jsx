import React from 'react'
import { Link } from 'react-router-dom'

export const NavBar = () => {
    return (
        <div className='bg-gray-800 text-white p-4 flex flex-wrap justify-between items-center'>
            <Link to='/' className='text-white text-3xl'>PhongVuPriceTracker</Link>
            <div className='flex space-x-8 mt-2 sm:mt-0'>
            </div>
        </div>
    )
}

export default NavBar
