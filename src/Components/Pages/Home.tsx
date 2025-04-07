import React, { useState, useEffect } from 'react';
import styles from '../Pagesmodulecss/Home.module.css';
import img1 from "../../assets/images/pngwing.com (3).png";
import img2 from "../../assets/images/laptop.png";
import img3 from "../../assets/images/pngwing.com (4).png";
import img4 from "../../assets/images/pngwing.com (2).png";
import img5 from "../../assets/images/pngwing.com.png";

const images = [
  { src: img1, title: "Control Your Home from Your Phone", description: "Manage devices like lights and TVs remotely, offering convenience from anywhere." },
  { src: img2, title: "Tailor Device Settings", description: "Adjust settings such as AC temperature or light brightness to fit your preferences." },
  { src: img3, title: "Scheduled Automation", description: "Set timers for devices to automate routines, like turning off fans at night." },
  { src: img4, title: "Stay Informed with Instant Alerts", description: "Receive notifications about device status, such as a refrigerator door left open." },
  { src: img5, title: "Energy Monitoring and Savings", description: "Track energy use to optimize appliance operation and reduce costs.." },
];

interface HomeProps {
  darkMode: boolean;
  username: string; // Receive the username from the parent
}

const Home: React.FC<HomeProps> = ({ darkMode, username }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.description}>
        <h1>Welcome to Smart Home Automation <span> {username}!😎</span></h1> {/* Display the username */}
        <h4 className={styles.descriptiontext}>Experience the future of home management with our innovative solutions.</h4>
      </div>

      <div className={styles.imageContainer}>
        <img
          src={images[currentImageIndex].src}
          alt={`Image ${currentImageIndex + 1}`}
          className={styles.image}
        />
        <div className={styles.textOverlay}>
          <h1>{images[currentImageIndex].title}</h1>
          <h6>{images[currentImageIndex].description}</h6>
        </div>
      </div>
    </div>
  );
};

export default Home;
