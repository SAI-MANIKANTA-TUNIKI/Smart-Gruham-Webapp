import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

// Define the SidebarData items directly
export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />, // Home icon
    cName: 'nav-text',
  },
  {
    title: 'All Room',
    path: '/OfficeRoom',
    icon: <IoIcons.IoMdBusiness />, // Business icon for office room
    cName: 'nav-text',
  },
  {
    title: 'HomeDeviceData', 
    path: '/DeviceData',
    icon: <FaIcons.FaDatabase />, // Database icon for device data
    cName: 'nav-text',
  },
  {
    title: 'Camera',
    path: '/Camera',
    icon: <IoIcons.IoMdCamera />, // Camera icon
    cName: 'nav-text',
  },
  {
    title: 'HomePowerSystem', 
    path: '/PowerSystem', 
    icon: <FaIcons.FaPowerOff />, // Power off icon for power systems
    cName: 'nav-text',
  },
  {
    title: 'LedStrip',
    path: "/LedStrip",
    icon: <IoIcons.IoIosColorPalette />, // Color palette icon for LED strip
    cName: 'nav-text',
  },
  {
    title: 'Settings',
    path: '/SettingsPage',
    icon: <AiIcons.AiFillSetting />, // Settings icon
    cName: 'nav-text',
  },
];
