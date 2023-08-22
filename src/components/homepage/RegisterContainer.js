import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'


const PASSWORD_VALIDATOR = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/;
const DISTRICTS = [
    'Ahmedabad',
    'Amreli',
    'Anand',
    'Aravalli',
    'Banaskantha',
    'Bharuch',
    'Bhavnagar',
    'Botad',
    'Chhotaudipur',
    'Dahod',
    'Dang',
    'Devbhumi Dwarka',
    'Gandhinagar',
    'Gir Somnath',
    'Jamnagar',
    'Junagadh',
    'Kheda',
    'Kutch',
    'Mahisagar',
    'Mehsana',
    'Morbi',
    'Narmada',
    'Navsari',
    'Panchmahal',
    'Patan',
    'Porbandar',
    'Rajkot',
    'Sabarkantha',
    'Surat',
    'Surendranagar',
    'Tapi',
    'Valsad',
    'Vadodara'
]
const SERVICES = [{ s: "Birth", n: 0 }, { s: "Marriage", n: 1 }, { s: "Death", n: 2 }];
const ONLY_NUMBER_VALIDATOR = new RegExp('^[0-9]+$');
const aadharReducer = (state, action) => {
    switch (action.type) {
        case "setAadhar":
            return { ...state, aadharNumber: action.aadharNumber }
        case "setAadharVal":
            if (!ONLY_NUMBER_VALIDATOR.test(state.aadharNumber) || state.aadharNumber.trim().length !== 12) {
                return { ...state, aadharNumberVal: false };
            }
            else
                return { ...state, aadharNumberVal: true };
        case "setAadharOTP":
            return {
                ...state, aadharOTP: { sent: action.sent, msg: action.msg, otp: action.otp }
            };
        case "setAadharVerification":
            return {
                ...state, aadharVerification: { verified: action.verified, msg: action.msg }
            };
        default:
            break;
    }
}

function RegisterContainer({ API }) {

    // const ME = useSelector(state => state.clerk.clerk);
    const token = useSelector(state => state.auth.token);
    const NAVIGATE = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (token) {
            NAVIGATE("/dashboard");
        }
    }, []);
    const [myAadhar, myDispatch] = useReducer(aadharReducer,
        {
            aadharNumber: "",
            aadharNumberVal: null,
            aadharOTP: { sent: null, msg: "", otp: "" },
            aadharVerification: { verified: null, msg: "" }
        });
    const [myOTP, setMyOTP] = useState("");
    const [myOTPVal, setMyOTPVal] = useState(false);
    const [myAadharData, setMyAadharData] = useState(null);

    const [district, setDistrict] = useState("");
    const [districtVal, setDistrictVal] = useState(false);
    useEffect(() => {
        if (DISTRICTS.includes(district)) {
            setDistrictVal(true)
        } else {
            setDistrictVal(false);
        }
    }, [district]);

    const [service, setService] = useState({ s: "", n: -1 });
    const [serviceVal, setServiceVal] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordVal, setPasswordVal] = useState(null);

    const [confirmPassword, setConfirmPassword] = useState(" ");
    const [confirmPasswordVal, setConfirmPasswordVal] = useState(null);
    useEffect(() => {
        if (!PASSWORD_VALIDATOR.test(password)) {
            setPasswordVal(false);
        } else { setPasswordVal(true); }
    }, [password]);
    // Validating confirm password
    useEffect(() => {
        if (password !== confirmPassword) {
            setConfirmPasswordVal(false)
        } else {
            setConfirmPasswordVal(true);
        }
    }, [password, confirmPassword]);


    useEffect(() => {
        if ([0, 1, 2].includes(service.n)) {
            setServiceVal(true)
        } else {
            setServiceVal(false);
        }
    }, [service]);
    useEffect(() => {
        if (!ONLY_NUMBER_VALIDATOR.test(myOTP) || myOTP.trim().length !== 4) {
            setMyOTPVal(false);
        } else {
            setMyOTPVal(true);
            axios.post(`${API}/citizen/verify-otp-for-aadhar`, { otp: myAadhar.aadharOTP.otp, clientOtp: myOTP, aadhar: myAadharData })
                .then(result => {
                    const DATA = result.data;
                    if (DATA.err) {
                        myDispatch({ type: "setAadharVerification", verified: false, msg: DATA.msg });
                    } else {
                        myDispatch({ type: "setAadharVerification", verified: true, msg: DATA.msg });
                        setMyAadharData(DATA.data);
                    }
                });
        }
        // eslint-disable-next-line
    }, [myOTP, API]);
    const verify_my_aadhar = () => {
        axios.post(`${API}/citizen/authenticate-aadhar`, { aadharNumber: myAadhar.aadharNumber, clerk: true })
            .then(result => {
                const DATA = result.data;
                if (DATA.err) {
                    myDispatch({ type: "setAadharOTP", sent: false, msg: DATA.msg, otp: "" });
                } else {
                    myDispatch({ type: "setAadharOTP", sent: true, msg: DATA.msg, otp: DATA.data.otp });
                    setMyAadharData(DATA.data.aadhar);
                }
            });
    }
    const register = async () => {
        const form = {
            aadharData: myAadharData,
            district,
            service,
            password
        };
        const res = await axios.post(`${API}/clerk/register`, form);
        const data = res.data;
        console.log(data);
    }
    return (
        <div >
            <div style={{}} className='homepage-login-container'>
                <h4 style={{ color: "wheat", paddingBottom: "1vh", letterSpacing: "1px" }}>REGISTER</h4>
                <Link to='/'><button className='green'>Already have an account ?</button></Link>
                <div style={{ display: "flex", gap: "2vh" }}>
                    {/* Aadhar verification */}
                    <div style={{ overflow: "auto", height: "48vh", display: "flex", gap: "2vw", flexDirection: "column" }}>
                        <div style={{ margin: "1vw 0vw 0vw 0vw" }}>
                            <input

                                className={myAadhar.aadharNumberVal ? 'normal-tb' : 'red-tb'}
                                disabled={myAadhar.aadharVerification.verified}
                                type='text'
                                placeholder="Aadhar number"
                                onChange={e => {

                                    myDispatch({ type: "setAadhar", aadharNumber: e.target.value });
                                    myDispatch({ type: "setAadharVal" });
                                }
                                }
                            ></input>
                            {myAadhar.aadharNumberVal && !myAadhar.aadharVerification.verified && <button style={{ width: "auto", marginLeft: "1vw" }} className='blue' onClick={verify_my_aadhar}>Verify</button>}
                        </div>
                        <div>
                            {/* <div>
                                {myAadhar.aadharOTP.sent !== null && !myAadhar.aadharVerification.verified && <span style={{ color: "white" }}>{myAadhar.aadharOTP.msg}</span>}
                            </div> */}
                            {myAadhar.aadharOTP.sent && !myAadhar.aadharVerification.verified
                                &&
                                <div style={{ color: "white" }}>
                                    <span>{myAadhar.aadharOTP.msg}</span>
                                    <input type='text' placeholder='OTP' onChange={e => setMyOTP(e.target.value)}></input>
                                    {!myOTPVal && <span>Enter 4 digit OTP</span>}
                                </div>
                            }
                        </div>
                        {myAadhar.aadharVerification.verified !== null
                            && <span style={{ color: "red" }}>{myAadhar.aadharVerification.msg}</span>
                        }
                        {myAadhar.aadharVerification.verified
                            &&
                            <span style={{ color: "white" }}>{myAadharData.firstName} {myAadharData.middleName} {myAadharData.lastName}</span>
                        }
                        {/* Details */}
                        {myAadhar.aadharVerification.verified &&
                            <div>
                                <select defaultValue={-1} onChange={e => setDistrict(e.target.value)}>
                                    <option disabled value={-1}>District</option>
                                    {DISTRICTS.map(district => <option key={district} value={district}>{district}</option>)}
                                </select>
                                {/* {!districtVal && <span>Please select a district</span>} */}
                                <select defaultValue={-1} onChange={e => setService({ s: "", n: parseInt(e.target.value) })}>
                                    <option disabled value={-1}>Select a service</option>
                                    {SERVICES.map(s => <option key={s.n} value={s.n}>{s.s}</option>)}
                                </select>
                                {/* {!serviceVal && <span>Please select a service</span>} */}
                            </div>
                        }
                        {
                            districtVal && serviceVal &&
                            <>
                                <div>
                                    <input className={passwordVal ? 'normal-tb' : 'red-tb'} onChange={e => setPassword(e.target.value)} placeholder='password' type='password'></input>
                                    {
                                        !passwordVal && <span style={{ color: "red" }}>Password must contain 8-12 chars and at least 1 special char,1 digit and 1 uppercase</span>
                                    }
                                </div>
                                <div>
                                    <input className={passwordVal ? 'normal-tb' : 'red-tb'} onChange={e => setConfirmPassword(e.target.value)} placeholder='Confirm password' type='password'></input>
                                    {
                                        !confirmPasswordVal && <span style={{ color: "red" }}>Password must same</span>
                                    }
                                </div>
                            </>
                        }
                        {
                            myAadhar.aadharVerification.verified && districtVal && serviceVal && passwordVal && confirmPasswordVal &&
                            <button onClick={register}>Register</button>
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default RegisterContainer