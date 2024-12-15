import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Signup from './Pages/Signup/Signup'
import { ToastContainer } from 'react-toastify';
import Protected from './Routes/Protected/Protected';
import UserRoutes from './Routes/UserRoutes/UserRoutes';
import UnProtected from './Routes/Protected/UnProtected';
import { useEffect, useState } from 'react';
import { requestFCMToken } from './Utils/firebaseUtils';
function App() {
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const fetchFCMToken = async () => {

      try {
        const token = await requestFCMToken();
        setFcmToken(token);
        console.log(token, '===========token kitty!')

      } catch (err) {
        console.error("error fethcing token", err)
      }
    }
    fetchFCMToken()
  }, [])


  return (

    <div>
      {/* <Router>

        <Routes>
          <Route element={<UnProtected />}>
            <Route element={<Signup />} path='/signup' />
            <Route element={<Login />} path='/login' />
          </Route>
          <Route element={<Protected />}>
          </Route>
          <Route element={<UserRoutes />} path='/*' />
        </Routes>
      </Router>


      <ToastContainer /> */}
    </div>


  )
}

export default App
