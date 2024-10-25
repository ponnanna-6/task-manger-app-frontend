import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login, Register, Dashboard, PublicTask, PageNotFound} from './pages'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Dashboard/>}/>
        <Route path="/share/task/:id" element={<PublicTask/>}/>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
