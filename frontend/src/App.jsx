import { useEffect, useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import Navbar from './components/Navbar'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'
import Spinner from './components/Spinner'

function App() {
  const [count, setCount] = useState(0);
  const { theme } = useThemeStore();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  if(isCheckingAuth && !authUser) {
    return (
      <Spinner />
    )
  }

  return (
    <div data-theme={theme}>
      <Navbar />  

      <Routes>
        <Route path='/' element={ authUser ? <HomePage /> : <Navigate to="/login" /> } />
        <Route path='/signup' element={ !authUser ? <SignupPage /> : <Navigate to="/" /> } />
        <Route path='/login' element={ !authUser ? <LoginPage /> : <Navigate to="/" /> } />
        <Route path='/settings' element={ <SettingsPage /> } />
        <Route path='/profile' element={ authUser ? <ProfilePage /> : <Navigate to="/login" /> } />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
