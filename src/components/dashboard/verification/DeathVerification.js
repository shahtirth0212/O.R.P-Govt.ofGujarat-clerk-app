import axios from 'axios';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../../../context/socketContext';
import Peer from 'simple-peer';


function DeathVerification({ API }) {
    const current = useSelector(state => state.clerk.current);
    const SOCKET = useSelector(state => state.clerk.socket);
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [form, setForm] = useState({});

    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState("")

    const [callerSignal, setCallerSignal] = useState()
    const [callEnded, setCallEnded] = useState(false)
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        });
        // On incoming call
        // socket.on("callUser", (data) => {
        //     setReceivingCall(true)
        //     setCaller(data.from)
        //     setCallerSignal(data.signal)
        // })
    }, [socket]);
    const callUser = () => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socket.emit("callUser", {
                userToCall: current.socket,
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
    useEffect(() => {
        console.log(current)
        axios.post(`${API}/clerk/form-verification`, { current })
            .then(res => {
                setForm(res.data);
            })
    }, [API, current])

    return (
        <div>
            <button onClick={callUser}>Start</button>
            <video autoPlay ref={myVideo} muted style={{ width: "300px" }}></video>
            <video ref={userVideo} autoPlay style={{ width: "300px" }} />
        </div>
    )
}

export default DeathVerification