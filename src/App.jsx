import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Login from './Pages/Login/Login'
import Signup from './Pages/Signup/Signup'
import { ToastContainer } from 'react-toastify';
import Protected from './Routes/Protected/Protected';
import UserRoutes from './Routes/UserRoutes/UserRoutes';
function App() {
  return (

    <div>
      <Router>

        <Routes>
          <Route element={<Signup />} path='/signup' />
          <Route element={<Login />} path='/login' />
          <Route element={<Protected />}>
          </Route>
          <Route element={<UserRoutes />} path='/*' />
        </Routes>
      </Router>


      <ToastContainer />
    </div>


  )
}

export default App
