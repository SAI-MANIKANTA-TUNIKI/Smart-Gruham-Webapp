import React, { useState, useEffect } from 'react';
import styles from '../Pagesmodulecss/Profile.module.css';
import { supabase } from '../../Gruham-Server/supabaseClient';

interface ProfileProps {
  darkMode: boolean;
  onUsernameChange: (newUsername: string) => void;
}



const Profile: React.FC<ProfileProps> = ({ darkMode, onUsernameChange }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>({
    name: '',
    nickname: '',
    bio: '',
    phone: '',
    email: '',
    dob: '',
    gender: '',
    address: '',
    website: '',
    profilePic: '',
    backgroundImage: ''
  });
  const [tempProfile, setTempProfile] = useState(profile);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

  // Fetch user profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') console.error('Fetch error:', error.message);
      if (data) {
        setProfile(data);
        setTempProfile(data);
        onUsernameChange(data.name || '');
      } else {
        const { error: insertError } = await supabase.from('profiles').insert([
          { user_id: user.id, email: user.email }
        ]);
        if (insertError) console.error('Insert error:', insertError.message);
      }
    };

    fetchProfile();
  }, [onUsernameChange]);

  // Upload image to Supabase Storage and return public URL
  const uploadProfilePic = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `profile-${userId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Image upload error:', uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    return data?.publicUrl || null;
  };

  const handleEditToggle = async () => {
    if (isEditing && userId) {
      let updatedProfile = { ...tempProfile };

      if (profilePicFile) {
        const publicUrl = await uploadProfilePic(profilePicFile);
        if (publicUrl) {
          updatedProfile.profilePic = publicUrl;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('user_id', userId);

      if (error) {
        alert('Error updating profile: ' + error.message);
        return;
      }

      setProfile(updatedProfile);
      onUsernameChange(updatedProfile.name);
    }

    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile((prev: any) => ({ ...prev, profilePic: reader.result as string }));
      };
      reader.readAsDataURL(file); // Still shows preview
    }
  };

  return (
    <div className={`${styles.profileContainer} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.profileContent}>
        <div
          className={styles.background}
          style={{ backgroundImage: `url(${tempProfile.backgroundImage})` }}
        ></div>
        <div className={styles.profilePicContainer}>
          <img src={tempProfile.profilePic || 'https://via.placeholder.com/150'} alt="Profile" className={styles.profilePic} />
          {isEditing && (
            <input type="file" accept="image/*" onChange={handleProfilePicChange} className={styles.fileInput} />
          )}
        </div>
        <button className={styles.editButton} onClick={handleEditToggle}>
          {isEditing ? 'Save' : 'Edit Profile'}
        </button>

        {/* Personal Info */}
        <div className={styles.section}>
          <h2>{isEditing ? <input name="name" value={tempProfile.name} onChange={handleInputChange} /> : profile.name}</h2>
          <p className={styles.nickname}>
            @{isEditing ? <input name="nickname" value={tempProfile.nickname} onChange={handleInputChange} /> : profile.nickname}
          </p>
          <p>{isEditing ? <textarea name="bio" value={tempProfile.bio} onChange={handleInputChange} /> : profile.bio}</p>
        </div>

        {/* Contact Info */}
        <div className={styles.section}>
          <h3>Contact</h3>
          <p>Phone: {isEditing ? <input name="phone" value={tempProfile.phone} onChange={handleInputChange} /> : profile.phone}</p>
          <p>Email: {isEditing ? <input name="email" value={tempProfile.email} onChange={handleInputChange} /> : profile.email}</p>
        </div>

        {/* Extra Details */}
        <div className={styles.section}>
          <h3>Details</h3>
          <p>DOB: {isEditing ? <input type="date" name="dob" value={tempProfile.dob} onChange={handleInputChange} /> : profile.dob}</p>
          <p>Gender: {isEditing ? <input name="gender" value={tempProfile.gender} onChange={handleInputChange} /> : profile.gender}</p>
          <p>Address: {isEditing ? <input name="address" value={tempProfile.address} onChange={handleInputChange} /> : profile.address}</p>
          <p>Website: {isEditing ? <input name="website" value={tempProfile.website} onChange={handleInputChange} /> : profile.website}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
