import React, { useState, useEffect } from 'react';
import axios from 'axios';


axios.defaults.baseURL = 'http://localhost:3001'; // Set the server's URL

function FileUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [images, setImages] = useState([]); // State to store retrieved images

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    const handleDeleteImage = (imageId) => {
        // Send a DELETE request to your server to delete the image
        axios.delete(`/images/${imageId}`)
            .then((response) => {
                console.log('Image deleted:', response.data);
                window.location.reload();
                getImages();
            })
            .catch((error) => {
                console.error('Error deleting image:', error);
            });
    };


    const handleUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('description', description);

            axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response) => {

                    console.log('Response Data:', response.data);
                    setUploadedImage(response.data.fileInfo);
                    window.location.reload();
                })
                .catch((error) => {
                    console.error(error);
                    if (error.response) {
                        console.error('Axios Response:', error.response.data);
                    }
                });
        } else {
            alert('Please select a file to upload.');
        }
    };

    // Function to retrieve images from the database
    const getImages = () => {
        axios.get('/images')
            .then((response) => {
                setImages(response.data);
            })
            .catch((error) => {
                console.error('Error fetching images:', error);
            });
    };

    // Call getImages when the component mounts
    useEffect(() => {
        getImages();
    }, []); // The empty array [] ensures that this effect runs only once on mount

    console.log(images);
    console.log(uploadedImage);

    return (

        <div className="file-upload-container">
            {/* <h2>Image Upload</h2> */}
            {/* <input className='upload-area' type="file" onChange={handleFileChange} />
            <textarea
                placeholder="Image Description (Optional)"
                value={description}
                onChange={handleDescriptionChange}
            /> */}
            <h2>Image Upload</h2>
            <label htmlFor="file" className="upload-area">
                <div className="file-input-wrapper">
                    {/* Your file input */}
                    <input
                        type="file"
                        id="file"
                        className="input-file"
                        onChange={handleFileChange}
                    />
                    <p>Click or drag and drop to upload</p>
                </div>
                {selectedFile && <p>{selectedFile.name}</p>}
            </label>
            <textarea
                placeholder="Image Description (Optional)"
                value={description}
                onChange={handleDescriptionChange}
            />
            <button className='upload-button' onClick={handleUpload}>Upload</button>

            {uploadedImage && (
                <div>
                    <h3>Uploaded Image:</h3>
                    <img
                        src={`./uploads/${uploadedImage.filename}`}
                        alt={uploadedImage.filename}
                    />
                    <p>Description: {uploadedImage.description}</p>
                </div>
            )}

            <h2>APES</h2>
            <div className="image-list">
                {images.map((image) => (
                    <div key={image.id}>
                        <img className='image'
                            src={`http://192.168.55.105:3001/uploads/${image.filename}`} // Use the /uploads URL path
                            alt={image.filename}
                        />
                        <p>Description: {image.description}</p>
                        <button onClick={() => handleDeleteImage(image.id)}>Delete</button>
                    </div>

                ))}
            </div>
        </div>
    );
}

export default FileUpload;
