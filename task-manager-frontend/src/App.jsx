import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login, Register, Dashboard} from './pages'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
