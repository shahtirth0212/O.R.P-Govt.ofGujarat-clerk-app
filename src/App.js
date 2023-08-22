import { RouterProvider, createBrowserRouter } from "react-router-dom";

// import { useContext, useEffect } from "react";
// Importing Homepage components
import LoginContainer from './components/homepage/LoginContainer';
import RegisterContainer from './components/homepage/RegisterContainer';
// Importing Dashboard components
import LiveRequests from './components/dashboard/LiveRequests';
import UpdateProfile from "./components/dashboard/UpdateProfile";
import PastRequests from './components/dashboard/PastRequests';
import BirthVerification from './components/dashboard/verification/BirthVerification';
import MarriageVerification from './components/dashboard/verification/MarriageVerification';
import DeathVerification from './components/dashboard/verification/DeathVerification';

// Importing Pages
import HomePage from './pages/Homepage';
import Dashboard from "./pages/Dashboard";
import { useCallback, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SocketContext, socket } from "./context/socketContext";
import { CLERK_ACTIONS } from "./redux-store/slices/clerk-slice";
// import { useDispatch } from "react-redux";
// import { CLERK_ACTIONS } from './redux-store/slices/clerk-slice';
// import { SocketContext } from "./context/socketContext";

const API = 'http://localhost:5000';
// const API = 'https://online-requisition-portal-gujarat.onrender.com';
// 
window.process = { env: { DEBUG: undefined } };
const ROUTER = createBrowserRouter(
  [
    // Homepage paths
    {
      path: '/', element: <HomePage />,
      children: [
        { index: true, element: <LoginContainer API={API} /> },
        { path: 'register', element: <RegisterContainer API={API} /> },
      ]
    },
    // Dashboard paths
    {
      path: '/dashboard', element: <Dashboard API={API} />,
      children: [
        { index: true, element: <LiveRequests API={API} /> },
        { path: "update-profile", element: <UpdateProfile API={API} /> },
        { path: "past-requests", element: <PastRequests API={API} /> },
        { path: "birth-verification", element: <BirthVerification API={API} /> },
        { path: "marriage-verification", element: <MarriageVerification API={API} /> },
        { path: "death-verification", element: <DeathVerification API={API} /> },
      ]
    }
  ]
);
window.onbeforeunload = function (e) {
  socket.emit('clerk-disconnected');
};
function App() {
  const socket = useContext(SocketContext)
  const dispatch = useDispatch();
  const handleGetSocketId = useCallback((id) => {
    console.log(id)
    dispatch(CLERK_ACTIONS.setSocket({ socket: id }))
  }, [dispatch])
  useEffect(() => {
    socket.on('get_my_socket_id', handleGetSocketId)
    return () => {
    }
  }, [socket, handleGetSocketId]);
  return (
    <div>
      <RouterProvider router={ROUTER}></RouterProvider>
    </div>
  );
}

export default App;
