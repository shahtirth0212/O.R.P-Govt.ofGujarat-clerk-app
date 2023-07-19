import React, { useEffect, useState } from 'react';
import './css/dashboard.css';
import { motion } from 'framer-motion';
import { CLERK_ACTIONS } from '../redux-store/slices/clerk-slice';
import Peer from "simple-peer"
import io from "socket.io-client"

// import LeftNavBar from '../components/dashboard/layout/LeftNavBar';
// import RightContainer from '../components/dashboard/layout/RightContainer';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

let service;

const socket = io.connect("http://localhost:5000/");
function Dashboard({ API }) {
    const NAVIGATE = useNavigate();
    const token = useSelector(state => state.auth.token);
    const ME = useSelector(state => state.clerk.clerk);
    const SOCKETID = useSelector(state => state.clerk.socket);
    // const ME =
    // {
    //     "_id": "64b663caf6bdc2d8e7ba6f9c",
    //     "email": "dhabu2212@gmail.com",
    //     "aadharData": {
    //         "aadharNumber": "102030405060",
    //         "firstName": "Devanshee",
    //         "middleName": "Vipulkumar",
    //         "lastName": "Ramanuj",
    //         "gender": "female",
    //         "DOB": "12/22/2001",
    //         "addressLine": "605,Akshar Residency",
    //         "district": "Gandhinagar",
    //         "state": "Gujarat",
    //         "mobile": "9427027620",
    //         "email": "dhabu2212@gmail.com"
    //     },
    //     "assignedSlots": [],
    //     "verifiedForms": [],
    //     "district": {
    //         "_id": "64b0db9ac7106a060202f43c",
    //         "name": "Gandhinagar",
    //         "__v": 0
    //     },
    //     "service": {
    //         "_id": "64b0ca36c78a2244149db638",
    //         "certi": 2
    //     },
    //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRoYWJ1MjIxMkBnbWFpbC5jb20iLCJfaWQiOiI2NGI2NjNjYWY2YmRjMmQ4ZTdiYTZmOWMiLCJpYXQiOjE2ODk2OTc3OTIsImV4cCI6MTY4OTcwMTM5Mn0.o7B-ALdBeDZkg8PO7S6qo-II6xKoi3gn9nD4NZbYzIg"
    // }
    if (ME.service.certi === 0) {
        service = "Birth";
    } else if (ME.service.certi === 1) {
        service = "Marriage"
    } else if (ME.service.certi === 2) {
        service = "Death"
    }
    // useEffect(() => {
    //     if (!token) {
    //         NAVIGATE("/login");
    //     }
    // }, [NAVIGATE, token])
    const dispatch = useDispatch();
    const [now, setNow] = useState(null);
    useEffect(() => {
        setInterval(() => {
            setNow(new Date().toLocaleTimeString())
        }, 1000);
        socket.on("get_my_socket_id", (id) => {
            dispatch(CLERK_ACTIONS.setSocket({ socket: id }))
        })
    }, []);
    const [status, setStatus] = useState("stop");
    const toggle_verification = async () => {
        if (status === 'stop') {
            setStatus("start");
            const res = await axios.post(`${API}/clerk/toggle-verification-status/start`, { clerkId: ME._id, socketId: SOCKETID });
            console.log(res.data);
        } else if (status === 'start') {
            setStatus("stop");
            const res = await axios.post(`${API}/clerk/toggle-verification-status/stop`, { clerkId: ME._id });
            console.log(res.data);
        }
    }
    return (
        <>
            <motion.div className='dashboard-header'
                initial={{ opacity: 0, y: '-100px' }}
                animate={{ opacity: 1, y: '0px' }}
                transition={{ duration: 1, delay: .2 }}
            >
                <h3>ONLINE REQUISITION PORTAL - GUJARAT</h3>
                <h4>Authority Section</h4>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: '-100px' }}
                animate={{ opacity: 1, y: '0px' }}
                transition={{ duration: 1, delay: 0.6 }} style={{ display: "flex", flexDirection: "row" }}>
                <div>
                    <h4>{new Date().toDateString()}</h4>
                    <h4>{now}</h4>
                </div>
                <div>
                    <h3>Hello, {ME.aadharData.firstName} {ME.aadharData.lastName}</h3>
                    <h4>{ME.aadharData.district} - {service} Service Department</h4>
                </div>
                <div>
                    <motion.span
                        initial={{ opacity: 0, x: '-200px' }}
                        animate={{ opacity: 1, x: '0px' }}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        <Link to='/dashboard'>Live Requests</Link>
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0, x: '-300px' }}
                        animate={{ opacity: 1, x: '0px' }}
                        transition={{ duration: 1, delay: 1.1 }}
                    >
                        <Link to='past-requests'>Previously verified</Link>
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0, x: '-400px' }}
                        animate={{ opacity: 1, x: '0px' }}
                        transition={{ duration: 1, delay: 1.2 }}
                    >
                        <Link to='update-profile'>Update profile</Link>
                    </motion.span>
                </div>
            </motion.div>
            <motion.div className='dashboard-container'>
                <button onClick={toggle_verification}>{status === 'start' ? 'stop' : "start"} verification</button>
            </motion.div>
            <motion.div>
                <Outlet />
            </motion.div>
        </>
    )
}
export default Dashboard;