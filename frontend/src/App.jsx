import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PageNotFound from './pages/PageNotFound';
import Onboarding from './pages/Onboarding';
import VideoCallPage from './pages/VideoCallPage';
import ChatPage from './pages/ChatPage';
import Notification from './pages/Notification';
import Otp from './pages/Otp';
import ResetPassword from './pages/ResetPassword';
import Groups from './components/Groups';
import Profile from './components/Profile';
import Friends from './pages/Friends';
import Dashboard from './components/Dashboard';

import { Toaster } from 'react-hot-toast';
import { isAuthenticated } from './operations/auth';
import ProtectedRoute from "./components/ProtectedRoute"
import { clearUserData, setUserData } from './redux/slices/user.slice';
import { toast } from 'react-hot-toast'
import LayoutLoader from './components/LayoutLoader';

const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/verifyotp',
  '/onboarding',
  '/resetpassword'
];

function App() {
  const [count, setCount] = useState(0);
  const [authLoading, setAuthLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const dataTheme = useSelector((state) => state.theme);

  useEffect(() => {
    let ignore = false;
    async function authentication() {
      try {
        const response = await isAuthenticated();
        if (ignore) return;
        if (response.networkError) {
          toast.error("Slow network connection detected, Can't authenticate you at this moment, please try again later");
        } else if (response.success === false && response.isValid === false) {
          dispatch(clearUserData());
          localStorage.removeItem("user");
        } else if (response.isValid) {
          dispatch(setUserData(response.user));
          localStorage.setItem("user", JSON.stringify(response.user));
        }
      } finally {
        if (!ignore) setAuthLoading(false);
      }
    }
    authentication();
    return () => { ignore = true; };
  }, [dispatch]);

  const isPublic = PUBLIC_ROUTES.includes(location.pathname);

  if (authLoading || (authLoading && !isPublic)) {
    return <LayoutLoader />;
  }

  return (
    <div className="min-h-screen w-full" data-theme={dataTheme || 'light'}>
      <Toaster />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/verifyotp' element={<Otp />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route
          path='/onboarding'
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path='/videocall/:id' element={
            <ProtectedRoute>
              <VideoCallPage />
            </ProtectedRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        >
          <Route path='/' element={<Dashboard />} />
          <Route path='/notifications' element={<Notification />} />
          <Route path='/friends' element={<Friends />} />
          <Route path='/groups' element={<Groups />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/chat/:id' element={<ChatPage />} />
        </Route>
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;