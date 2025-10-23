import { BrowserRouter as Router, Routes, Route } from 'react-router'
import './index.css'
import Register from './users/Register'
import NotFound from './NotFound'
import Home from './Pages/Home'
import Login from './users/Login'
import { AuthProvider } from './context/authContext'

function App() {
  return <>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          {/* Admin Routes  */}
          <Route path='/auth'>
            <Route path='/auth/register' element={<Register />} />
            <Route path='/auth/login' element={<Login />} />
          </Route>
          {/* Not Found Route */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  </>
}

export default App
