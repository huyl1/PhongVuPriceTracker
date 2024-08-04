import React from 'react'
import { Link } from 'react-router-dom'

export const BackButton = () => {
  return (
    <div className='flex items-center mt-4 mb-4'>
        <Link to='/' className='flex items-center'>
            <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 mr-2'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            >
            <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
            />
            </svg>
            <span>Back to products</span>
        </Link>
    </div>
  )
}


export default BackButton;
