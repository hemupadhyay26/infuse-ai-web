import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Signup from './auth/Signup';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* <Route index element={<Home />} /> */}
      {/* <Route path="login" element={<Login />} /> */}
      <Route path="/auth/signup" element={<Signup />} />
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