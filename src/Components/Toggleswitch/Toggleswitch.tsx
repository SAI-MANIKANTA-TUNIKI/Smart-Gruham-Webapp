import React from 'react';
import styles from './Toggleswitch.module.css';

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange }) => {
  return (
    <div className={styles.mid}>
      <label className={styles.rocker}>
        <input
          type="checkbox"
          id={`toggle-switch-${id}`}
          checked={checked}
          onChange={onChange}
        />
        <span className={styles['switch-left']}>On</span>
        <span className={styles['switch-right']}>Off</span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
