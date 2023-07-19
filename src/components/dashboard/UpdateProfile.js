import React from 'react'
import { motion } from 'framer-motion'

function UpdateProfile() {
    return (
        <motion.div
            initial={{ opacity: 0, y: '+100px' }}
            animate={{ opacity: 1, y: '0px' }}
            transition={{ duration: 1, delay: .2 }}
        >
            Update profile here
        </motion.div>
    )
}

export default UpdateProfile