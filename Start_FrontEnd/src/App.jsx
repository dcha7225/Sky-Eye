import { useState,  } from 'react'
import './App.css'
import WebcamStreamCapture from './components/WebcamRec' 
import FileDropZone from './components/FileSub'


function App() {
  const [showCam, setShowCam] = useState(false)

  const handleClick = () => {
    if (showCam){
      setShowCam(false);
     }
     else{
      setShowCam(true);
     }
  };

  return (
    <>
    <main>
      <h1>Start</h1>
      <FileDropZone/>
      <button onClick={handleClick}>toggle Camera</button>
      {showCam && <WebcamStreamCapture/>}
    </main>
    </>
  )
}

export default App
