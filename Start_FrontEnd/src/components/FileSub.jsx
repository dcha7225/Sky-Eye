import React, { useState, useRef } from 'react';

function FileDropZone(props) {
  const [dragging, setDragging] = useState(false);
  const {file, setFile} = props;
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files;
    setFile(droppedFile[0]);
    console.log(file)
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files;
    setFile(selectedFile[0]);
    console.log(file)
  };

  const handleFileInputClick = () => {
    // Trigger the file input when the box is clicked
    fileInputRef.current.click();
  };

  return (
    <div
      className={`file-drop-zone ${dragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleFileInputClick} // Clicking the box triggers the file input
      style={{
        border: '2px dotted #000',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer', // Change the cursor to indicate it's clickable
      }}
    >
      {file == null ? (dragging ? (
        <p>Drop the files here</p>
      ) : (
        <p>Drag and drop files here or click to select</p>
      )):
        <p>{file.name}</p>
      }
      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
      />
    </div>
  );
}

export default FileDropZone;
