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
    const handleJoinRequest = useCallback((res) => {
        if (!BUSY) {
            console.log(res)
            dispatch(CLERK_ACTIONS.setCitizen({ citizen: res.citizen }));
            toast.info(`Citizen is ready to join...`);
            dispatch(CLERK_ACTIONS.enQueue({ request: res.slot }));
        } else {
            socket.emit('other-verification-in-process', res.citizen);
        }
    }, []);

    useEffect(() => {
        socket.on('citizen-ready-to-join', handleJoinRequest);
    }, [socket]);

    // Verification
    const set_verified = async (status, req) => {
        console.log(req)
        if (status) {
            const confirm = window.confirm('You are setting a form as verified...');
            if (confirm) {
                const res = await axios.post(`${API}/clerk/set-verification`, { ans: true, appliedCertificateId: req.appliedCertificateId });
                toast.success(res.data.msg);
            } else
                return
        } else {
            const objection = window.prompt('You are rejecting a request, Please mention the objection or cancel');
            if (objection && objection.length > 5) {
                const res = await axios.post(`${API}/clerk/set-verification`, { ans: false, appliedCertificateId: req.appliedCertificateId, objection: objection });
                toast.error(res.data.msg);
            } else
                return
        }
    }

    const start_verification = (req) => {
        dispatch(CLERK_ACTIONS.setCurrent({ request: req }));
        dispatch(CLERK_ACTIONS.setBusyTrue());
        dispatch(CLERK_ACTIONS.deQueue());
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
                style={{ borderRadius: "8px", padding: "1vw", border: "2px solid white", marginTop: "4vh" }}
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
                            <h4 style={{ padding: "1vw", color: 'white' }}>Citizen Queue</h4>
                            {QUEUE.map(q => {
                                return (
                                    <span style={{ padding: "1vw", color: 'wheat' }} key={q.appliedCertificateId}>Citizen is ready to join...  <button className='green' onClick={e => start_verification(q)}>Accept</button></span>
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
                                    <th scope="col">Joining Status</th>
                                    <th scope="col">Verification</th>
                                </tr>
                            </thead>
                            <tbody style={{ background: "#ffffff94", fontWeight: "bold" }}>
                                {liveRequests.map((req, i) => {
                                    i++;
                                    return (
                                        <tr key={req._id}>
                                            <td>{i}</td>
                                            <td>{req.added.timing.time}</td>
                                            <td>{req.added.applied_certi.holders[0].firstName}</td>
                                            <td>{req.added.applied_certi.verified ? "Verified" : req.added.applied_certi.objection.length > 0 ? "Rejected" : "not-verified"}</td>
                                            <td>{req.added.applied_certi.joined ? "Attended" : "-"}</td>
                                            <td>{req.added.applied_certi.joined

                                                ? <><button style={{ marginRight: "1vw", width: "auto" }} className='green' onClick={() => set_verified(1, req)}>Accept</button><button style={{ width: "auto" }} className='red' onClick={() => set_verified(0, req)}>Reject</button></>
                                                : "-"}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </>
                }
                {
                    res.length === 0 && liveRequests.length === 0 &&
                    <h4 style={{ color: "#c8ffd2", letterSpacing: "2px", fontWeight: "normal" }}>No current requests found !</h4>
                }
            </motion.div >
        </ >
    )
}

export default LiveRequests