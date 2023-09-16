import { useState,  } from 'react'
import './App.css'
import WebcamStreamCapture from './components/WebcamRec' 
import FileDropZone from './components/FileSub'
import axios from 'axios';

function App() {
  const [showCam, setShowCam] = useState(false)
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)

  const handleToggle = () => {
    if (showCam){
      setShowCam(false);
     }
     else{
      setShowCam(true);
     }
  };

  const handleUpload = () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      setLoading(true);

      axios
        .post('http://127.0.0.1:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob', 
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: 'video/webm' });

          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'result.webm';
          document.body.appendChild(a);

          a.click();

          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          console.log('File download successful');
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error downloading file', error);
          setLoading(false);
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
      {loading && <div className="loading">Processing...</div>} 
    </main>
    </>
  )
}

export default App
