import { useState,  } from 'react'
import './App.css'
import WebcamStreamCapture from './components/WebcamRec' 
import FileDropZone from './components/FileSub'
import axios from 'axios';
import shooting_star from './images/shooting_star.png'; 

function App() {
  const [showCam, setShowCam] = useState(false)
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)
  const [videoUrl, setVideoUrl] = useState(null);

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
          
          const videoUrl = window.URL.createObjectURL(blob);

          setVideoUrl(videoUrl); // Set the video URL in the state
          /*
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'result.webm';
          document.body.appendChild(a);

          a.click();

          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          */ 

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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={shooting_star} style={{ width: '25%', height: 'auto' }} alt="Logo of Shooting Star" />
      </div>
      <h1>Start</h1>
      <p style={{ fontSize: '16px' }} >record or submit a video</p>

      <FileDropZone file={file} setFile={setFile}/>
      <button onClick={handleToggle}>toggle Camera</button>
      <button onClick={handleUpload}>Submit</button>
      {showCam && <WebcamStreamCapture/>}
      {loading && <div className="loading">Processing...</div>}
      {videoUrl && (
          <video controls>
            <source src={videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        )} 
    </main>
    </>
  )
}

export default App
