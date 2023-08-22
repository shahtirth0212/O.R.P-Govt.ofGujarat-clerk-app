import io from "socket.io-client";
import React from "react";

export const socket = io.connect('http://localhost:5000');
// export const socket = io.connect('https://online-requisition-portal-gujarat.onrender.com');
export const SocketContext = React.createContext();