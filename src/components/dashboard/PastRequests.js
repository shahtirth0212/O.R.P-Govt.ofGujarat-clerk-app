import React from 'react'
import { motion } from 'framer-motion'
function PastRequests() {
    return (
        <motion.div
            initial={{ opacity: 0, y: '+100px' }}
            animate={{ opacity: 1, y: '0px' }}
            transition={{ duration: 1, delay: .2 }}
        >
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">No.</th>
                        <th scope="col">Form</th>
                        <th scope="col">Holder</th>
                        <th scope="col">Slot booked (24h)</th>
                        <th scope="col">Verified</th>
                        <th scope="col">Get certificate</th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        </motion.div>
    )
}

export default PastRequests