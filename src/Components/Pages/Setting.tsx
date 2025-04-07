import React, { useState, useEffect } from 'react';
import styles from '../Pagesmodulecss/Setting.module.css';
import { useNavigate } from 'react-router-dom'; // ✅ Import navigate

interface SettingsPageProps {
  darkMode: boolean;
  onToggleDarkMode: (newMode: boolean) => void;
  handleSignOut: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ darkMode, onToggleDarkMode, handleSignOut }) => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  // States
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(darkMode);
  const [deviceName, setDeviceName] = useState('');
  const [devices, setDevices] = useState<string[]>([]);
  const [bluetoothDevice, setBluetoothDevice] = useState<any>(null);

  const profileImage = 'https://via.placeholder.com/40'; // Placeholder

  // ✅ Use navigate instead of window.location.href
  const handleProfileClick = () => {
    navigate('/Profile');
  };

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (deviceName.trim()) {
      setDevices([...devices, deviceName]);
      setDeviceName('');
      sendDeviceToESP32(deviceName);
    }
  };

  const sendDeviceToESP32 = (name: string) => {
    console.log(`Sending HTTP request to ESP32 with device name: ${name}`);
    fetch('http://esp32.local/add-device', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceName: name }),
    })
      .then((response) => response.json())
      .then((data) => console.log('ESP32 Response:', data))
      .catch((error) => console.error('ESP32 HTTP Error:', error));
  };

  const connectToDevice = async () => {
    try {
      const device = await (navigator as any).bluetooth.requestDevice({
        filters: [{ namePrefix: 'ESP32' }],
        optionalServices: ['battery_service'],
      });
      const server = await device.gatt?.connect();
      console.log('Connected to ESP32 via Bluetooth:', server);
      setBluetoothDevice(device);

      device.addEventListener('gattserverdisconnected', () => {
        console.log('ESP32 Disconnected');
        setBluetoothDevice(null);
      });
    } catch (error) {
      console.error('Bluetooth Connection Error:', error);
    }
  };

  useEffect(() => {
    document.body.className = darkModeEnabled ? 'dark-mode' : '';
  }, [darkModeEnabled]);

  const handleDarkModeToggle = () => {
    onToggleDarkMode(!darkMode);
    setDarkModeEnabled(!darkModeEnabled);
  };

  return (
    <div className={styles.settingsContainer}>
      <h1 className={styles.settings1}>Settings</h1>

      {/* Profile Section */}
      <div className={styles.section}>
        <h2>Profile</h2>
        <button onClick={handleProfileClick} className={styles.profileButton}>
          <img src={profileImage} alt="Profile" className={styles.profileImage} />
          Go to Profile
        </button>
      </div>

      {/* Notifications Section */}
      <div className={styles.section}>
        <h2>Notifications</h2>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* Dark Mode Section */}
      <div className={styles.section}>
        <h2>Dark Mode</h2>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={darkModeEnabled}
            onChange={handleDarkModeToggle}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* Sign Out Section */}
      <div className={styles.section}>
        <h2>Sign Out</h2>
        <button onClick={handleSignOut} className={styles.signOutButton}>
          Sign Out
        </button>
      </div>

      {/* Add New Device Section */}
      <div className={styles.section}>
        <h2>Add New Device</h2>
        <form onSubmit={handleAddDevice} className={styles.deviceForm}>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Device Name"
            className={styles.deviceInput}
          />
          <button type="submit" className={styles.addButton}>
            Add Device
          </button>
        </form>
        <ul className={styles.deviceList}>
          {devices.map((device, index) => (
            <li key={index}>{device}</li>
          ))}
        </ul>
      </div>

      {/* ESP32 Bluetooth Connection */}
      <div className={styles.section}>
        <h2>ESP32 Connection</h2>
        <button
          onClick={connectToDevice}
          className={styles.bluetoothButton}
          disabled={bluetoothDevice !== null}
        >
          {bluetoothDevice ? 'Connected to ESP32' : 'Connect to ESP32'}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
