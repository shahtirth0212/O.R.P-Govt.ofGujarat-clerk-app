import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

import { CLERK_ACTIONS } from '../../redux-store/slices/clerk-slice';

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
                console.log(data);
                dispatch(CLERK_ACTIONS.setClerk({ clerk: data.data }));
                NAVIGATE("/dashboard");
            }
        }
    }
    return (
        <div className='homepage-login-container'>
            <div>
                <h4>LOGIN</h4>
                <Link to='register'><button>Register</button></Link>
            </div>
            <div>
                <input onChange={e => setEmail(e.target.value)} type='email' placeholder='Email'></input>
                {!emailVal && <span>Please enter email</span>}
                {
                    emailVal &&
                    <input onChange={e => setPassword(e.target.value)} type='password' placeholder='Password'></input>
                }
                {emailVal && !passwordVal && <span>Please enter a valid pattern</span>}
                {passwordVal && emailVal && <button onClick={login}>Login</button>}
                {res.length > 0 && <span>{res}</span>}
            </div>
        </div >
    )
}

export default LoginContainer