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

  const API_URL = "https://retailiq-backend-tbs4.onrender.com";

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
      console.log("Fetch Profile Error:", error);
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

      alert("Profile saved successfully!");
    } catch (error) {
      console.log("Save Profile Error:", error);
      alert("Could not save profile");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Business Profile</h2>

        <p>
          These details will appear on your invoice PDF.
        </p>

        <div className="profile-grid">
          <input
            type="text"
            name="shopName"
            value={profile.shopName}
            onChange={handleChange}
            placeholder="Shop Name"
          />

          <input
            type="text"
            name="gstin"
            value={profile.gstin}
            onChange={handleChange}
            placeholder="GSTIN"
          />

          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Business Email"
          />

          <input
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            placeholder="Shop Address"
          />

          <input
            type="text"
            name="website"
            value={profile.website}
            onChange={handleChange}
            placeholder="Website"
          />
        </div>

        <h3>Bank Details</h3>

        <div className="profile-grid">
          <input
            type="text"
            name="accountName"
            value={profile.accountName}
            onChange={handleChange}
            placeholder="Account Holder Name"
          />

          <input
            type="text"
            name="accountNumber"
            value={profile.accountNumber}
            onChange={handleChange}
            placeholder="Account Number"
          />

          <input
            type="text"
            name="ifsc"
            value={profile.ifsc}
            onChange={handleChange}
            placeholder="IFSC Code"
          />

          <input
            type="text"
            name="bankName"
            value={profile.bankName}
            onChange={handleChange}
            placeholder="Bank Name"
          />
        </div>

        <button
          className="save-profile-btn"
          onClick={saveProfile}
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;