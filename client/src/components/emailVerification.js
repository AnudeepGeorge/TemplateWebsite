// EmailVerification.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Emailverification.css";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const verifyEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setIsVerified(true);
        setErrorMessage("");
      } else {
        setErrorMessage(data.message || "Verification failed.");
        setIsVerified(false);
      }
    } catch (error) {
      setErrorMessage("Server error. Please try again later.");
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    const profilePicUrl = URL.createObjectURL(profilePic);

    navigate("/template", {
      state: { name: name, profilePic: profilePicUrl },
    });
  };

  return (
    <div className="container">
      <h1>Login with Registered Email</h1>
      <form onSubmit={verifyEmail}>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Verify Email</button>
      </form>
      {errorMessage && <div id="message">{errorMessage}</div>}

      {isVerified && (
        <div id="nameFormContainer">
          <h2>Upload Your Profile</h2>
          <form onSubmit={handleProfileSubmit}>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              required
            />
            <input
              type="file"
              onChange={handlePicChange}
              accept="image/*"
              required
            />
            <button type="submit">Upload Profile</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
