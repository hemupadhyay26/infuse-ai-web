import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Signup from './pages/auth/Signup';
import './App.css'
import Landing from './pages/landing/Landing';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ChatPage from './pages/chat/Chat';
import ChatHistory from './pages/chatHistory/ChatHistory';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Landing />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/history" element={<ChatHistory />} />
    </Route>
  )
)

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;