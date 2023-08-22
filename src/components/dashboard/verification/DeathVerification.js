import axios from 'axios';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../../context/socketContext';
import { CLERK_ACTIONS } from '../../../redux-store/slices/clerk-slice';
import Peer from 'simple-peer';
import { toast } from 'react-toastify';


function DeathVerification({ API }) {
    const current = useSelector(state => state.clerk.current);
    const SOCKET = useSelector(state => state.clerk.socket);
    const CITIZEN = useSelector(state => state.clerk.citizen);
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const BUSY = useSelector(state => state.clerk.busy);
    const [form, setForm] = useState(null);
    const dispatch = useDispatch();
    const [stream, setStream] = useState()
    const [callAccepted, setCallAccepted] = useState(false)

    // const [callerSignal, setCallerSignal] = useState()
    // const [callEnded, setCallEnded] = useState(false)
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()
    const handleJoinRequest = useCallback((res) => {
        if (!BUSY) {
            console.log(BUSY)
            dispatch(CLERK_ACTIONS.setCitizen({ citizen: res.citizen }));
            toast.info(`Another Citizen is ready to join...`);
            dispatch(CLERK_ACTIONS.enQueue({ request: res.slot }));
        } else {
            socket.emit('other-verification-in-process', res.citizen);
        }
    }, []);
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        });
        socket.on('citizen-ready-to-join', handleJoinRequest);
    }, [socket]);
    const callUser = () => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: CITIZEN,
                signalData: data,
                from: SOCKET,
            })
        })
        peer.on("stream", (stream) => {
            console.log(stream)
            userVideo.current.srcObject = stream
        })
        socket.on("callAccepted", (signal) => {
            console.log(signal)
            setCallAccepted(true)
            peer.signal(signal)
            console.log(peer)
            console.log(signal)
        })

        connectionRef.current = peer
    }
    const end_call = () => {
        socket.emit('end-call', { citizen: CITIZEN });
        stream.getTracks().forEach(track => {
            track.stop();
        });
        connectionRef.current = null;
        myVideo.current.srcObject = null;
        dispatch(CLERK_ACTIONS.setBusyFalse());
        dispatch(CLERK_ACTIONS.setCurrent({ request: null }));
        // dispatch(CLERK_ACTIONS.deQueue());
        navigate('/dashboard')
    }
    useEffect(() => {
        console.log(current)
        axios.post(`${API}/clerk/form-verification`, { current })
            .then(res => {
                setForm(res.data.data);
                console.log(res.data)
            })
    }, [API, current])
    return (

        <>
            <div>
                {!callAccepted && <button onClick={callUser}>Start Call</button>}
                <video autoPlay ref={myVideo} muted style={{ width: "300px" }}></video>
                <video ref={userVideo} autoPlay style={{ width: "300px" }} />
                {callAccepted && <button onClick={end_call}>End Call</button>}
            </div>
            {form && <div>
                <hr></hr>
                <div className='death-basic-details'>
                    <div>
                        <h4>Date of Death:</h4><span>{new Date(form.dateOfDeath).toDateString()}</span>
                    </div>
                    <div>
                        <h4>Place of Death:</h4><span>{form.placeOfDeath}</span>
                    </div>
                    <div>
                        <h4>Death Type:</h4><span>{form.deathType}</span>
                    </div>
                    <div>
                        <h4>Death Reason:</h4><span>{form.deathReason}</span>
                    </div>
                    <div>
                        <h4>Death declaration of Hospital</h4><img alt='hospital' src={form.hospitalDeclaration} style={{ width: "500px", height: "500px" }} />
                        <h4>Declaration by crematorium</h4><img alt='crematorium' src={form.crematoriumDeclaration} style={{ width: "500px", height: "500px" }} />
                    </div>
                </div >
                <hr></hr>
                <div className='death-person-details'>
                    <div>
                        <h4>Deceased person</h4><img alt='person' src={form.person.photo} style={{ width: "250px", height: "250px" }} />
                        <div>
                            <h4>Aadhaar Details</h4><span>{form.person.aadharNumber}</span>
                        </div>
                        <div>
                            <span>{form.personName}</span>
                            <span>{form.person.gender}</span>
                            <span>{form.person.DOB}</span>
                            <span>{form.person.addressLine} | {form.person.district}</span>
                            <span>{form.person.mobile}</span>
                        </div>
                    </div>
                </div>
                <div className='death-filler-details'>
                    <div>
                        <h4>Filler</h4><img alt='filler' src={form.filler.photo} style={{ width: "250px", height: "250px" }} />
                        <div>
                            <h4>Relation to the Deceased person</h4><span>{form.relation}</span>
                        </div>
                        <div>
                            <h4>Aadhaar Details</h4><span>{form.filler.aadharNumber}</span>
                        </div>
                        <div>
                            <span>{form.filler.firstName} {form.filler.middleName} {form.filler.lastName}</span>
                            <span>{form.filler.gender}</span>
                            <span>{form.filler.DOB}</span>
                            <span>{form.filler.addressLine} | {form.filler.district}</span>
                            <span>{form.filler.mobile}</span>
                        </div>
                    </div>
                </div>
            </div>}
            {!form && <h3>Details fetching...</h3>}
        </>
    )
}

export default DeathVerification