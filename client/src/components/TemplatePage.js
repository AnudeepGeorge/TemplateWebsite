import React from "react";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import "./TemplatePage.css";

const TemplatePage = () => {
  const location = useLocation();
  const { name, profilePic } = location.state || {};

  const handleShareClick = async (event) => {
    event.preventDefault();

    try {
      const element = document.querySelector(".template-page");
      const canvas = await html2canvas(element);
      const imageBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      const file = new File([imageBlob], `${name || "profile"}.png`, {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Event Image",
          text: `I'm attending the event!`,
          files: [file],
        });
      } else {
        const imageUrl = URL.createObjectURL(imageBlob);
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `${name || "profile"}.png`;
        link.click();
        URL.revokeObjectURL(imageUrl);
      }
    } catch (error) {
      console.error("Error capturing or sharing image:", error);
    }
  };

  return (
    <div className="template-page">
      <div className="profile-section">
        {profilePic && (
          <img src={profilePic} alt="Profile" className="profile-pic" />
        )}
        {name && <div className="user-name">{name}</div>}
      </div>

      <div className="share-links">
        <a href="#!" onClick={handleShareClick}>
          Share
        </a>
      </div>
    </div>
  );
};

export default TemplatePage;
