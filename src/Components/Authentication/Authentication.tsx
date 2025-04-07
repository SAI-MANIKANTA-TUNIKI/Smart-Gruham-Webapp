import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Pagesmodulecss/Authentication.module.css";
import img2 from "../../assets/images/login.png";
import { supabase } from "../../Gruham-Server/supabaseClient"; // ✅ Centralized import

interface AuthenticationProps {
  onLogin: () => void;
}

const Authentication: React.FC<AuthenticationProps> = ({ onLogin }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [signUpValues, setSignUpValues] = useState({ name: "", email: "", password: "" });
  const [loginValues, setLoginValues] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpValues({ ...signUpValues, [e.target.name]: e.target.value });
  };

  const handleSignUpSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { error } = await supabase.auth.signUp({
      email: signUpValues.email,
      password: signUpValues.password,
      options: {
        data: {
          name: signUpValues.name
        }
      }
    });

    if (error) {
      alert(`Sign Up Error: ${error.message}`);
      return;
    }

    alert("User registered successfully. Please check your email to confirm your account.");
    navigate("/");
  };

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginValues.email,
      password: loginValues.password
    });

    if (error) {
      alert(`Login Error: ${error.message}`);
      return;
    }

    if (data.session) {
      onLogin(); // Let App.tsx handle token/state
      navigate("/home");
    }
  };

  return (
    <div className={styles.Authenticationbody}>
      <a href="http://localhost:5173/" className={styles.logo} target="_blank" rel="noopener noreferrer">
        <img src={img2} alt="Logo" className={styles.logoImage} />
        <samp className={styles.logoText}>Gruham</samp>
      </a>

      <div className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.row} ${styles.fullHeight} ${styles.justifyContentCenter}`}>
            <div className={`${styles.col12} ${styles.textCenter} ${styles.alignSelfCenter} ${styles.py5}`}>
              <div className={`${styles.section} ${styles.pb5} ${styles.pt5} ${styles.ptSm2} ${styles.textCenter}`}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  id="reg-log"
                  name="reg-log"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="reg-log"></label>
                <div className={styles.card3dWrap}>
                  <div className={styles.card3dWrapper}>
                    {/* Login Card */}
                    <div className={styles.cardFront}>
                      <div className={styles.centerWrap}>
                        <div className={styles.section}>
                          <h4 className={styles.mb4}>Log In</h4>
                          <form onSubmit={handleLoginSubmit}>
                            <div className={styles.formGroup}>
                              <input
                                type="email"
                                name="email"
                                value={loginValues.email}
                                onChange={(e) => setLoginValues({ ...loginValues, email: e.target.value })}
                                className={styles.formStyle}
                                placeholder="Your Email"
                                autoComplete="off"
                              />
                            </div>
                            <div className={`${styles.formGroup} ${styles.mt2}`}>
                              <input
                                type="password"
                                name="password"
                                value={loginValues.password}
                                onChange={(e) => setLoginValues({ ...loginValues, password: e.target.value })}
                                className={styles.formStyle}
                                placeholder="Your Password"
                                autoComplete="off"
                              />
                            </div>
                            <button type="submit" className={styles.btn}>
                              Submit
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Sign Up Card */}
                    <div className={styles.cardBack}>
                      <div className={styles.centerWrap}>
                        <div className={styles.section}>
                          <h4 className={styles.mb4}>Sign Up</h4>
                          <form onSubmit={handleSignUpSubmit}>
                            <div className={styles.formGroup}>
                              <input
                                type="text"
                                name="name"
                                value={signUpValues.name}
                                onChange={handleSignUpChange}
                                className={styles.formStyle}
                                placeholder="Your Full Name"
                                autoComplete="off"
                              />
                            </div>
                            <div className={`${styles.formGroup} ${styles.mt2}`}>
                              <input
                                type="email"
                                name="email"
                                value={signUpValues.email}
                                onChange={handleSignUpChange}
                                className={styles.formStyle}
                                placeholder="Your Email"
                                autoComplete="off"
                              />
                            </div>
                            <div className={`${styles.formGroup} ${styles.mt2}`}>
                              <input
                                type="password"
                                name="password"
                                value={signUpValues.password}
                                onChange={handleSignUpChange}
                                className={styles.formStyle}
                                placeholder="Your Password"
                                autoComplete="off"
                              />
                            </div>
                            <button type="submit" className={styles.btn}>
                              Submit
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                    {/* End of card3dWrapper */}
                  </div>
                </div>
                {/* End of section */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
