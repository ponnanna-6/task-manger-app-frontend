import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Login, Register, Dashboard, Settings} from './pages'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>

        
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/settings' element={<Settings/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
