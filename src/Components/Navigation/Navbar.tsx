import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from '../Navigation/Sidebar';
import styles from '../Pagesmodulecss/Navbar.module.css';
import { IconContext } from 'react-icons';

const Navbar: React.FC = () => {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <div className="mainContent">
        <IconContext.Provider value={{ color: '#fff' }}>
          <div className={styles.navbar}>
            {/* Logo in Navbar */}
            <div className={styles.logoContainer}>
              <Link to="/" className={styles.logo}>
                <img src="your-logo-path.png" alt="Logo" className={styles.logoImg} />
              </Link>
            </div>

            {/* Menu Button */}
            <Link to="#" className={styles.menuBars} onClick={showSidebar}>
              <FaIcons.FaBars />
            </Link>
          </div>

          {/* Sidebar */}
          <nav className={`${styles.navMenu} ${sidebar ? styles.active : ''}`}>
            <ul className={styles.navMenuItems} onClick={showSidebar}>
              <li className={styles.navbarToggle}>
                <Link to="#" className={styles.menuBars}>
                  <AiIcons.AiOutlineClose />
                </Link>
              </li>
              {SidebarData.map((item, index) => (
                <li key={index} className={styles.navText}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </IconContext.Provider>
      </div>
    </>
  );
};

export default Navbar;
