import React, { useState, useEffect } from "react";
import ToggleSwitch from "../Toggleswitch/Toggleswitch";
import styles from "../Pagesmodulecss/OfficeRoom.module.css";
import { motion } from "framer-motion";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface DeviceConfig {
  type: string;
  id: string;
  image_url: string;
  is_on: boolean;
}

interface RoomConfig {
  id: string;
  name: string;
  image_url: string;
  devices: DeviceConfig[];
}

interface DeviceState {
  [key: string]: { checked: boolean };
}

interface NewDevice {
  type: string;
  id: string;
  image_url: string | File | null; // Updated to handle both string and File
}

interface OfficeRoomProps {
  darkMode: boolean;
}

const OfficeRoom: React.FC<OfficeRoomProps> = ({ darkMode }) => {
  const [rooms, setRooms] = useState<RoomConfig[]>([]);
  const [currentRoom, setCurrentRoom] = useState<RoomConfig | null>(null);
  const [devices, setDevices] = useState<DeviceState>({});
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [newDevice, setNewDevice] = useState<NewDevice>({
    type: '',
    id: '',
    image_url: null // Initial value as null
  });
  const [newRoomName, setNewRoomName] = useState('');
  const [profitData, setProfitData] = useState(0);

  useEffect(() => {
    fetchRooms();

    const subscription = supabase
      .channel('devices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices'
        },
        (payload) => {
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    const onCount = Object.values(devices).filter(device => device.checked).length;
    setProfitData(onCount);
  }, [devices]);

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select(`
        *,
        devices (
          id,
          type,
          device_id,
          image_url,
          is_on
        )
      `);

    if (error) {
      console.error('Error fetching rooms:', error);
      return;
    }

    const formattedRooms: RoomConfig[] = data.map((room: any) => ({
      id: room.id,
      name: room.name,
      image_url: room.image_url,
      devices: room.devices.map((device: any) => ({
        type: device.type,
        id: device.device_id,
        image_url: device.image_url,
        is_on: device.is_on
      }))
    }));

    setRooms(formattedRooms);
    if (formattedRooms.length > 0 && !currentRoom) {
      setCurrentRoom(formattedRooms[0]);
      setDevices(formattedRooms[0].devices.reduce((acc: DeviceState, device: DeviceConfig) => {
        acc[device.id] = { checked: device.is_on };
        return acc;
      }, {}));
    }
  };

  const handleRealtimeUpdate = (payload: any) => {
    if (payload.eventType === 'UPDATE' && currentRoom) {
      const updatedDevice = payload.new;
      if (updatedDevice.room_id === currentRoom.id) {
        setDevices(prev => ({
          ...prev,
          [updatedDevice.device_id]: { checked: updatedDevice.is_on }
        }));
        
        setCurrentRoom(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            devices: prev.devices.map(device =>
              device.id === updatedDevice.device_id
                ? { ...device, is_on: updatedDevice.is_on }
                : device
            )
          };
        });
      }
    }
  };

  const handleToggle = async (deviceId: string) => {
    const updatedChecked = !devices[deviceId]?.checked;
    
    setDevices(prev => ({
      ...prev,
      [deviceId]: { checked: updatedChecked },
    }));

    const { error } = await supabase
      .from('devices')
      .update({ is_on: updatedChecked })
      .eq('device_id', deviceId);

    if (error) {
      console.error('Error updating device state:', error);
      setDevices(prev => ({
        ...prev,
        [deviceId]: { checked: !updatedChecked },
      }));
    }
  };

  const handleTurnOffAllDevices = async () => {
    if (!currentRoom) return;

    const updatedDevices = Object.keys(devices).reduce((acc, key) => {
      acc[key] = { checked: false };
      return acc;
    }, {} as DeviceState);
    
    setDevices(updatedDevices);

    const { error } = await supabase
      .from('devices')
      .update({ is_on: false })
      .eq('room_id', currentRoom.id);

    if (error) {
      console.error('Error turning off all devices:', error);
      await fetchRooms();
    }
  };

  const handleAddDevice = async () => {
    if (!newDevice.type || !newDevice.id || !newDevice.image_url || !currentRoom) return;

    let imageUrl: string;
    
    // Handle image upload if it's a File
    if (newDevice.image_url instanceof File) {
      const file = newDevice.image_url;
      const filePath = `${currentRoom.id}/${newDevice.id}-${Date.now()}`;
      
      const { error: uploadError } = await supabase.storage
        .from('device-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('device-images')
        .getPublicUrl(filePath);
      imageUrl = publicUrlData.publicUrl;
    } else {
      imageUrl = newDevice.image_url as string;
    }

    const { error } = await supabase
      .from('devices')
      .insert({
        room_id: currentRoom.id,
        type: newDevice.type,
        device_id: newDevice.id,
        image_url: imageUrl,
        is_on: false
      });

    if (error) {
      console.error('Error adding device:', error);
      return;
    }

    setDevices(prev => ({
      ...prev,
      [newDevice.id]: { checked: false },
    }));
    setNewDevice({ type: '', id: '', image_url: null });
    await fetchRooms();
  };

  const handleAddRoom = async () => {
    if (!newRoomName.trim()) return;

    const { error } = await supabase
      .from('rooms')
      .insert({
        name: newRoomName,
        image_url: '/images/default-room.jpg'
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding room:', error);
      return;
    }

    setNewRoomName('');
    await fetchRooms();
  };

  const handleRoomSwitch = (roomId: string) => {
    const selectedRoom = rooms.find(room => room.id === roomId);
    if (selectedRoom) {
      setCurrentRoom(selectedRoom);
      setDevices(selectedRoom.devices.reduce((acc: DeviceState, device: DeviceConfig) => {
        acc[device.id] = { checked: device.is_on };
        return acc;
      }, {}));
    }
  };

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>, deviceId: string) => {
    const newName = e.target.value;
    
    const { error } = await supabase
      .from('devices')
      .update({ type: newName })
      .eq('device_id', deviceId);

    if (error) console.error('Error updating device name:', error);
    await fetchRooms();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, deviceId: string) => {
    if (!e.target.files || !currentRoom) return;
    const file = e.target.files[0];
    const filePath = `${currentRoom.id}/${deviceId}-${Date.now()}`;
    
    const { error: uploadError } = await supabase.storage
      .from('device-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('device-images')
      .getPublicUrl(filePath);

    const { error: updateError } = await supabase
      .from('devices')
      .update({ image_url: publicUrlData.publicUrl })
      .eq('device_id', deviceId);

    if (updateError) console.error('Error updating image URL:', updateError);
    await fetchRooms();
  };

  const handleEditButtonClick = (deviceId: string) => {
    setEditMode(prev => ({
      ...prev,
      [deviceId]: !prev[deviceId],
    }));
  };

  return (
    <div className={darkMode ? styles.darkMode : styles.lightMode}>
      <div className={styles.switchesContainer}>
        <header className={styles.header}>
          <h1>{currentRoom?.name || 'Select a Room'} Control</h1>
          <div>
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => handleRoomSwitch(room.id)}
              >
                Switch to {room.name}
              </button>
            ))}
          </div>
        </header>

        {currentRoom && (
          <div className={styles.devicesGrid}>
            {currentRoom.devices.map((device, i) => (
              <motion.div
                key={i}
                className={styles.deviceCard}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={styles.deviceInfo}>
                  <div className={styles.deviceImage}>
                    <img
                      src={device.image_url}
                      alt={device.type}
                      className={styles.deviceImageStyle}
                    />
                  </div>
                  <div className={styles.deviceName}>
                    {editMode[device.id] ? (
                      <div>
                        <input
                          type="text"
                          value={device.type}
                          onChange={(e) => handleNameChange(e, device.id)}
                          className={styles.inputName}
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, device.id)}
                          className={styles.inputImage}
                        />
                      </div>
                    ) : (
                      <span>{device.type}</span>
                    )}
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditButtonClick(device.id)}
                    >
                      <span className={styles.threeDots}>...</span>
                    </button>
                  </div>
                </div>
                <div className={styles.deviceStatus}>
                  <ToggleSwitch
                    id={device.id}
                    checked={devices[device.id]?.checked || false}
                    onChange={() => handleToggle(device.id)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {currentRoom && (
          <div className={styles.addDeviceForm}>
            <input
              type="text"
              placeholder="Device Name"
              value={newDevice.type}
              onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
              className={styles.inputName}
            />
            <input
              type="text"
              placeholder="Device ID"
              value={newDevice.id}
              onChange={(e) => setNewDevice({ ...newDevice, id: e.target.value })}
              className={styles.inputName}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setNewDevice({
                ...newDevice,
                image_url: e.target.files[0]
              })}
              className={styles.inputImage}
            />
            <button onClick={handleAddDevice} className={styles.addButton}>Add Device</button>
          </div>
        )}

        <div className={styles.addConfigForm}>
          <input
            type="text"
            placeholder="New Room Name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className={styles.inputName}
          />
          <button onClick={handleAddRoom} className={styles.addButton}>Add Room</button>
        </div>

        {currentRoom && (
          <div className={styles.controls}>
            <button className={styles.turnOffAll} onClick={handleTurnOffAllDevices}>
              Turn Off All Devices
            </button>
            <p className={styles.deviceStatusText}>Devices On: {profitData}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficeRoom;