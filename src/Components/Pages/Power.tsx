import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import styles from '../Pagesmodulecss/Power.module.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const PowerSystem = ({ darkMode }: { darkMode: boolean }) => {
  const [view, setView] = useState('Month');
  const [powerData, setPowerData] = useState({
    totalUsage: 0,
    usagePerRoom: { kitchen: 0, bathroom: 0, livingRoom: 0, orangeLivingRoom: 0 },
    usagePerDay: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)),
    usagePerWeek: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50)),
    usagePerMonth: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50)),
  });

  useEffect(() => {
    const fetchData = () => {
      const randomData = {
        totalUsage: Math.floor(Math.random() * 200),
        usagePerRoom: {
          kitchen: Math.floor(Math.random() * 50),
          bathroom: Math.floor(Math.random() * 20),
          livingRoom: Math.floor(Math.random() * 40),
          orangeLivingRoom: Math.floor(Math.random() * 30),
        },
        usagePerDay: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)),
        usagePerWeek: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50)),
        usagePerMonth: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50)),
      };
      setPowerData(randomData);
    };
    fetchData();
  }, []);

  const { totalUsage, usagePerRoom, usagePerDay, usagePerWeek, usagePerMonth } = powerData;

  const data = {
    labels: view === 'Day' ? Array.from({ length: 24 }, (_, i) => `${i}:00`) :
            view === 'Week' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] :
            ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'kWh',
        data: view === 'Day' ? usagePerDay :
              view === 'Week' ? usagePerWeek :
              usagePerMonth,
              backgroundColor: 'rgba(43, 255, 0, 0.98)', // Updated color for the chart
              borderRadius: 10,
              borderWidth: 2,
              borderColor: 'rgb(251, 255, 0)', // Updated color
              hoverBackgroundColor: 'rgb(255, 0, 0)',
              hoverBorderColor: 'rgb(2, 129, 255)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
          font: {
            size: 14,
            weight: 'bold' as const,  // Ensure 'bold' is explicitly typed as a literal string
          },
          color: darkMode ? '#e0e0e0' : '#212121',
        },
      },
      x: {
        ticks: {
          font: {
            size: 14,
            weight: 'bold' as const,  // Same here, ensure 'bold' is explicitly typed as a literal string
          },
          color: darkMode ? '#e0e0e0' : '#212121',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 16,
            weight: 'bold' as const,  // Explicitly type 'bold' as a literal string
          },
          color: darkMode ? '#e0e0e0' : '#212121',
        },
      },
      tooltip: {
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3eff03',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.label}: ${tooltipItem.raw} kWh`;
          },
        },
      },
    },
  };
  

  return (
    <div className={styles.dashboardContainer}>

    <div>
      <h1 className={styles.pageTitle}>Power Usage Dashboard</h1>
      <div className={styles.timeFrame}>
        <span onClick={() => setView('Day')} className={view === 'Day' ? styles.active : ''}>Day</span>
        <span onClick={() => setView('Week')} className={view === 'Week' ? styles.active : ''}>Week</span>
        <span onClick={() => setView('Month')} className={view === 'Month' ? styles.active : ''}>Month</span>
      </div>
      <div className={styles.totalUsage}>
        <h2>{totalUsage} kWh</h2>
        <p className={styles.usageChange}>22% Increase</p>
        <p className={styles.usageChangeValue}>12.54 kWh</p>
      </div>
      <div className={styles.chartContainer}>
        <Bar data={data} options={options} />
      </div>
      <div className={styles.usagePerRoom}>
        {Object.entries(usagePerRoom).map(([room, usage]) => (
          <div key={room} className={styles.roomUsage}>
            {room.charAt(0).toUpperCase() + room.slice(1)}: {usage} kWh
            <span className={styles.usagePercent}> ({((usage / totalUsage) * 100).toFixed(2)}%)</span>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default PowerSystem;
