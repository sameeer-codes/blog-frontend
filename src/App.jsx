import { BrowserRouter as Router, Routes, Route } from 'react-router'
import './index.css'
import Register from './auth/Register'
import NotFound from './NotFound'
import Home from './Pages/Home'
import Login from './auth/Login'
import { AuthProvider } from './context/AuthContext'

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
