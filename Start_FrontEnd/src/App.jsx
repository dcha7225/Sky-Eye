import { useState,  } from 'react'
import './App.css'
import WebcamStreamCapture from './components/WebcamRec' 
import FileDropZone from './components/FileSub'
import axios from 'axios';

function App() {
  const [showCam, setShowCam] = useState(false)
  const [file, setFile] = useState(null);

  const handleToggle = () => {
    if (showCam){
      setShowCam(false);
     }
     else{
      setShowCam(true);
     }
  };
  const handleOnChange = (e) => {
    const target = e.target;
    console.log("target", target.files);
    setFile()
  }
  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      axios
        .post('http://127.0.0.1:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          // Handle the response from the server if needed
          console.log('File upload successful', response);
        })
        .catch((error) => {
          // Handle any errors that occur during the upload
          console.error('Error uploading file', error);
        });
      } 
      else{
        alert("No file uploaded")
      }
  };

  return (
    <>
    <main>
      <h1>Start</h1>
      <FileDropZone file={file} setFile={setFile}/>
      <button onClick={handleToggle}>toggle Camera</button>
      <button onClick={handleUpload}>Submit</button>
      {showCam && <WebcamStreamCapture/>}
    </main>
    </>
  )
}

export default App
