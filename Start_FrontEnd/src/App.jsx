import { useState } from 'react'
import './App.css'
import WebcamStreamCapture from './components/WebcamRec' 


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <main className='bg'>
      <h1>Start</h1>
      <WebcamStreamCapture></WebcamStreamCapture>
    </main>
    </>
  )
}

export default App
