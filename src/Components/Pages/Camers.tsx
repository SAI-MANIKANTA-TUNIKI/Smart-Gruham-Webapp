import React, { useState } from 'react'; 
import styles from '../Pagesmodulecss/Camers.module.css';

interface CameraProps {
  darkMode: boolean;
}

interface CameraData {
  id: number;
  section: string;
  status: string;
  imgSrc: string;
}

const Camera: React.FC<CameraProps> = ({ darkMode }) => {
  // Initial camera data
  const initialCameraData: CameraData[] = [
    { id: 1, section: '1st Floor', status: 'Closed', imgSrc: 'https://via.placeholder.com/400x300?text=Camera+1' },
  ];

  // State to manage camera data
  const [cameraData, setCameraData] = useState<CameraData[]>(initialCameraData);
  const [newCamera, setNewCamera] = useState<CameraData>({ id: 0, section: '', status: 'Closed', imgSrc: '' });

  // Handle form input change for new camera
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCamera({
      ...newCamera,
      [name]: value
    });
  };

  // Handle adding the new camera
  const handleAddCamera = () => {
    if (newCamera.section && newCamera.imgSrc) {
      // Set the new ID by incrementing the last ID
      const newId = cameraData.length > 0 ? Math.max(...cameraData.map(c => c.id)) + 1 : 1;
      
      const addedCamera = { ...newCamera, id: newId };
      setCameraData([...cameraData, addedCamera]);
      
      // Reset the newCamera form after adding
      setNewCamera({ id: 0, section: '', status: 'Closed', imgSrc: '' });
    } else {
      alert('Please provide all details (section, imgSrc)');
    }
  };

  return (
    <div className={`${darkMode ? styles.darkMode : ""}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Camera Security System</h1>
        <nav className={styles.nav}>
          <button className={styles.navButton}>Sensors</button>
          <button className={styles.navButton}>Cameras</button>
        </nav>
      </header>

      <section className={styles.cameraList}>
        {/* Display existing cameras */}
        {cameraData.map((camera) => (
          <div
            key={camera.id}
            className={`${styles.cameraCard} ${styles[camera.status.toLowerCase()]}`}
          >
            <img
              src={camera.imgSrc}
              alt={`Camera view from ${camera.section}`}
              className={styles.cameraImage}
            />
            <div className={styles.cameraInfo}>
              <p className={styles.cameraSection}>Section: {camera.section}</p>
              <p className={styles.cameraStatus}>Status: {camera.status}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Add New Camera Form */}
      <section className={styles.addCameraForm}>
        <h2>Add New Camera</h2>
        <input
          type="text"
          name="section"
          value={newCamera.section}
          onChange={handleInputChange}
          placeholder="Section"
          className={styles.inputField}
        />
        <input
          type="text"
          name="imgSrc"
          value={newCamera.imgSrc}
          onChange={handleInputChange}
          placeholder="Image URL"
          className={styles.inputField}
        />
        <button onClick={handleAddCamera} className={styles.addButton}>
          Add Camera
        </button>
      </section>
    </div>
  );
};

export default Camera;
