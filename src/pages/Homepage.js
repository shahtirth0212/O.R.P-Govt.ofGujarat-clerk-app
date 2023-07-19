import React from 'react';
import '../pages/css/homepage.css';
import LeftContainer from '../components/homepage/layouts/LeftContainer'
import RightContainer from '../components/homepage/layouts/RightContainer'
function Homepage() {
    return (
        <>
            <div className='homepage-header'
                initial={{ opacity: 0, y: '-100px' }}
                animate={{ opacity: 1, y: '0px' }}
                transition={{ duration: 1, delay: .2 }}
            >
                <h3>ONLINE REQUISITION PORTAL - GUJARAT</h3>
                <h4>Authority Section</h4>
            </div>
            <div className='homepage-grid-wrapper'>
                <LeftContainer />
                <RightContainer />
            </div>
            <div className='homepage-footer-image'
                initial={{ opacity: 0, y: '+100px' }}
                animate={{ opacity: 1, y: '0px' }}
                transition={{ duration: 1, delay: .2 }}
            ></div>
        </>
    )
}

export default Homepage