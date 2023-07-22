import React, { useCallback, useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from '../../context/socketContext';
import { toast } from 'react-toastify';
import { CLERK_ACTIONS } from '../../redux-store/slices/clerk-slice';
import { useNavigate } from 'react-router-dom';
function LiveRequests({ API }) {
    const ME = useSelector(state => state.clerk.clerk);
    const [res, setRes] = useState("");
    const [liveRequests, setLiveRequests] = useState([]);
    const socket = useContext(SocketContext);
    const BUSY = useSelector(state => state.clerk.busy);
    const QUEUE = useSelector(state => state.clerk.citizen_queue);
    const service = useSelector(state => state.clerk.service);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        axios.post(`${API}/clerk/get-live-requests`, { clerkId: ME._id, certi: ME.service.certi.toString(), service_id: ME.service._id })
            .then((response => {
                const DATA = response.data;
                if (DATA.err) {
                    setRes(DATA.msg);
                } else {
                    // new Date() > new Date('Wed Jul 19 2023 10:00') && new Date() < new Date('Wed Jul 19 2023 13:00')
                    setLiveRequests(DATA.data);
                }
            }));
    }, [API, ME._id, ME.service._id, ME.service.certi]);

    // Socket functions
    const handleJoinRequest = useCallback((data) => {
        if (!BUSY) {
            data.slot.socket = data.citizen;
            toast.info(`Citizen is ready to join...`);
            dispatch(CLERK_ACTIONS.enQueue({ request: data.slot }));
        } else {
            socket.emit('other-verification-in-process', data.citizen);
        }
    }, []);

    useEffect(() => {
        socket.on('citizen-ready-to-join', handleJoinRequest);
    }, [socket]);

    // Verification


    const start_verification = (req) => {
        dispatch(CLERK_ACTIONS.setCurrent({ request: req }));
        dispatch(CLERK_ACTIONS.setBusyTrue());
        // dispatch(CLERK_ACTIONS.deQueue());
        // socket.emit('you-can-join-now', { req, clerk_socket: socket.id });
        if (service === "Birth") {
            navigate('birth-verification')
        } else if (service === "Marriage") {
            navigate('marriage-verification')
        } else if (service === "Death") {
            navigate('death-verification')
        }

    }
    return (
        <>
            < motion.div
                initial={{ opacity: 0, y: '+100px' }
                }
                animate={{ opacity: 1, y: '0px' }}
                transition={{ duration: 1, delay: .2 }}
            >
                {res.length > 0 && <h4>{res}</h4>}
                {
                    res.length === 0 && liveRequests.length > 0 &&
                    <>
                        {QUEUE.length > 0 && <div >
                            <h4>Citizen Queue</h4>
                            {QUEUE.map(q => {
                                return (
                                    <span key={q.appliedCertificateId}>Citizen is ready to join...<button onClick={e => start_verification(q)}>Accept</button></span>
                                )
                            })}
                        </div>
                        }
                        <table className="table">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">No.</th>
                                    <th scope="col">Timing (24h)</th>
                                    <th scope="col">Holder</th>
                                    <th scope="col">Verification status</th>
                                    <th scope="col">Ready to join</th>
                                    <th scope="col">Set verified</th>
                                </tr>
                            </thead>
                            <tbody>
                                {liveRequests.map((req, i) => {
                                    i++;
                                    return (
                                        <tr key={req._id}>
                                            <td>{i}</td>
                                            <td>{req.added.timing.time}</td>
                                            <td>{req.added.applied_certi.holders[0].firstName}</td>
                                            <td>{req.added.applied_certi.verified ? "verified" : "not-verified"}</td>
                                            <td>ready?</td>
                                            <td><button>verified</button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </>
                }
                {
                    res.length === 0 && liveRequests.length === 0 &&
                    <h4>No current requests found</h4>
                }
            </motion.div >
        </ >
    )
}

export default LiveRequests