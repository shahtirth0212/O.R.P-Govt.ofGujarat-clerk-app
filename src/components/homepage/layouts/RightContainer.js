import React from 'react'
import { Outlet } from 'react-router-dom';
function RightContainer() {
    return (
        <div className='homepage-right-container'>
            <Outlet />
        </div>
    )
}

export default RightContainer