import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';


function LiveRequests({ API }) {
    const get_24h_string = (date, time) => {
        // 13:00-14:00
        let [start, end] = time.split('-');
        const starting = new Date(date + " " + start);
        const ending = new Date(date + " " + start);
        return { starting, ending };
    }
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
    //         "district": "Junagadh",
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
    const ME = useSelector(state => state.clerk.clerk);
    const [res, setRes] = useState("");
    const [liveRequests, setLiveRequests] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const response = await axios.post(`${API}/clerk/get-live-requests`, { clerkId: ME._id, certi: ME.service.certi.toString(), service_id: ME.service._id });
            const DATA = response.data;
            if (DATA.err) {
                setRes(DATA.msg);
            } else {
                console.log(DATA)
                // new Date() > new Date('Wed Jul 19 2023 10:00') && new Date() < new Date('Wed Jul 19 2023 13:00')
                setLiveRequests(DATA.data);
            }
        }
        fetchData();
    }, []);



    return (
        <motion.div
            initial={{ opacity: 0, y: '+100px' }}
            animate={{ opacity: 1, y: '0px' }}
            transition={{ duration: 1, delay: .2 }}
        >
            {res.length > 0 && <h4>{res}</h4>}
            {res.length === 0 && liveRequests.length > 0 &&
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
            }
            {
                res.length === 0 && liveRequests.length === 0 &&
                <h4>No current requests found</h4>
            }
        </motion.div>
    )
}

export default LiveRequests