import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Importing Homepage components
import LoginContainer from './components/homepage/LoginContainer';
import RegisterContainer from './components/homepage/RegisterContainer';
// Importing Dashboard components
import LiveRequests from './components/dashboard/LiveRequests';
import UpdateProfile from "./components/dashboard/UpdateProfile";
import PastRequests from './components/dashboard/PastRequests';

// Importing Pages
import HomePage from './pages/Homepage';
import Dashboard from "./pages/Dashboard";

const API = 'http://localhost:5000';


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
        { path: "past-requests", element: <PastRequests API={API} /> }
      ]
    }
  ]
);

function App() {
  return (
    <div>
      <RouterProvider router={ROUTER}></RouterProvider>
    </div>
  );
}

export default App;
