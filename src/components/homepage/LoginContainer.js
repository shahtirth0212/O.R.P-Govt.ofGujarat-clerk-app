import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import '../../UI/greenButton.css';
import '../../UI/input.css';
import '../../UI/blueButton.css';


import { CLERK_ACTIONS } from '../../redux-store/slices/clerk-slice';
import { AUTH_ACTIONS } from '../../redux-store/slices/auth-slice';
const EMAIL_VALIDATOR = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_VALIDATOR = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;

function LoginContainer({ API }) {
    // const ME = useSelector(state => state.clerk.clerk);
    const token = useSelector(state => state.auth.token);
    const NAVIGATE = useNavigate();
    useEffect(() => {
        if (token) {
            NAVIGATE('/dashboard')
        }
    }, []);
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [emailVal, setEmailVal] = useState(false);
    useEffect(() => {
        if (EMAIL_VALIDATOR.test(email)) {
            setEmailVal(true);
        } else {
            setEmailVal(false);
        }
    }, [email]);

    const [password, setPassword] = useState("");
    const [passwordVal, setPasswordVal] = useState(false);
    useEffect(() => {
        if (PASSWORD_VALIDATOR.test(password)) {
            setPasswordVal(true);
        } else {
            setPasswordVal(false);
        }
    }, [password]);

    const [res, setRes] = useState("");

    const login = async () => {
        if (emailVal && passwordVal) {
            const response = await axios.post(`${API}/clerk/login`, { email, password })
            const data = response.data;
            if (data.err) {
                setRes(data.msg)
            } else {
                console.log(data)
                dispatch(CLERK_ACTIONS.setClerk({ clerk: data.data }));
                dispatch(AUTH_ACTIONS.setToken({ token: data.data.token }))
                NAVIGATE("/dashboard");
            }
        }
    }
    return (
        <div className='homepage-login-container'>
            <div>
                <h4 style={{ color: "wheat", paddingBottom: "1vh", letterSpacing: "1px" }}>LOGIN</h4>
            </div>
            <div style={{ display: "flex", gap: "2vh", flexDirection: "column" }}>
                <Link to='register'><button className='green'>Don't have an account ?</button></Link>
                <div>
                    <input className={emailVal ? 'normal-tb' : 'red-tb'} onChange={e => setEmail(e.target.value)} type='email' placeholder='Email'></input>
                </div>
                {!emailVal && <span style={{ color: "red" }}>Please enter a valid email</span>}
                {
                    emailVal &&
                    <div>
                        <input className={passwordVal ? 'normal-tb' : 'red-tb'} onChange={e => setPassword(e.target.value)} type='password' placeholder='Password'></input>
                    </div>
                }
                {emailVal && !passwordVal && <span style={{ color: "red" }}>Please enter a valid pattern</span>}
                {passwordVal && emailVal && <button className='blue' style={{ width: "6vw" }} onClick={login}>Login</button>}
                {res.length > 0 && <span style={{ color: "red" }}>{res}</span>}
            </div>
        </div >
    )
}

export default LoginContainer