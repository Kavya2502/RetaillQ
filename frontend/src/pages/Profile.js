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

    <div className="profile-grid">
      <input name="shopName" placeholder="Shop Name" />
      <input name="gstin" placeholder="GSTIN" />
      <input name="email" placeholder="Business Email" />
      <input name="address" placeholder="Shop Address" />
      <input name="website" placeholder="Website" />
    </div>

    <h3>Bank Details</h3>

    <div className="profile-grid">
      <input name="accountName" placeholder="Account Holder Name" />
      <input name="accountNumber" placeholder="Account Number" />
      <input name="ifsc" placeholder="IFSC Code" />
      <input name="bankName" placeholder="Bank Name" />
    </div>

    <button className="save-profile-btn">
      Save Profile
    </button>

  </div>
</div>
  );
}

export default Profile;