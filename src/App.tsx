import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import SalonPage from './pages/SalonPage'
import NotFoundPage from './pages/NotFoundPage'
import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from 'react-router-dom'
import MainLayout from './components/Layout/MainLayout'

const router = createBrowserRouter ((
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<HomePage />} />
      <Route path='/search' element={<SearchPage />} />
      <Route path={'/salon/:id'} element={ <SalonPage/> } />
      <Route path={'*'} element={ <NotFoundPage /> } />
    </Route>  
  )
))

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App