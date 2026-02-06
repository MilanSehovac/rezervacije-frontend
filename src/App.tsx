import HomePage from './pages/public/HomePage'
import SearchPage from './pages/public/SearchPage'
import SalonPage from './pages/public/SalonPage'
import NotFoundPage from './pages/NotFoundPage'
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'
import MainLayout from './layouts/MainLayout/MainLayout'
import { AuthProvider } from './components/context/AuthContext'
import ServicesPage from './pages/public/ServicesPage'
import ProfilePage from './pages/user/ProfilePage'
import ProtectedRoute from './components/routes/ProtectedRoute'

const router = createBrowserRouter ((
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path='/search' element={<SearchPage />} />
      <Route path={'/salon/:id'} element={ <SalonPage/>} loader={async ({params}) => {
        const res = await fetch(`/api/salons/${params.id}`);
        const data = await res.json();
        return data;
      }} />
      <Route path={'/services'} element={<ServicesPage />} />
      <Route path={'*'} element={ <NotFoundPage /> } />
      <Route path={'/profile'} element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
    </Route>  
  )
))

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App