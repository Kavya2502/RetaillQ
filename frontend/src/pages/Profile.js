import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState({
    shopName: "",
    gstin: "",
    email: "",
    address: "",
    website: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
  });

  const API_URL = "https://retailiq-backend.onrender.com";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile({
        shopName: res.data.shopName || "",
        gstin: res.data.gstin || "",
        email: res.data.email || "",
        address: res.data.address || "",
        website: res.data.website || "",
        accountName: res.data.accountName || "",
        accountNumber: res.data.accountNumber || "",
        ifsc: res.data.ifsc || "",
        bankName: res.data.bankName || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(`${API_URL}/api/profile`, profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile saved successfully");
    } catch (error) {
      console.log(error);
      alert("Could not save profile");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Business Profile</h2>
        <p>These details will appear on your invoice PDF.</p>

        <input name="shopName" placeholder="Shop Name" value={profile.shopName} onChange={handleChange} />
        <input name="gstin" placeholder="GSTIN" value={profile.gstin} onChange={handleChange} />
        <input name="email" placeholder="Business Email" value={profile.email} onChange={handleChange} />
        <input name="address" placeholder="Shop Address" value={profile.address} onChange={handleChange} />
        <input name="website" placeholder="Website" value={profile.website} onChange={handleChange} />

        <h3>Bank Details</h3>

        <input name="accountName" placeholder="Account Holder Name" value={profile.accountName} onChange={handleChange} />
        <input name="accountNumber" placeholder="Account Number" value={profile.accountNumber} onChange={handleChange} />
        <input name="ifsc" placeholder="IFSC Code" value={profile.ifsc} onChange={handleChange} />
        <input name="bankName" placeholder="Bank Name" value={profile.bankName} onChange={handleChange} />

        <button onClick={saveProfile}>Save Profile</button>
      </div>
    </div>
  );
}

export default Profile;