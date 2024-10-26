import React, { useState, useEffect } from "react";

const EmailIcon = ({ email }) => {
  const [initials, setInitials] = useState("");
  const [bgColor, setBgColor] = useState("");

  const getRandomColor = () => {
    const colors = [
      "#FF5733", "#33FF57", "#5733FF", "#FFC300", "#33FFC3", "#FF33A8",
      "#C70039", "#900C3F", "#581845", "#28B463", "#5DADE2", "#AF7AC5"
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  useEffect(() => {
    if (email) {
      const parts = email.split("@")[0];
      const initials = parts.substring(0, 2).toUpperCase();
      setInitials(initials);
      setBgColor(getRandomColor());
    }
  }, [email]);

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      width: "100%", 
      height: "100%",
      borderRadius: "50%",
      backgroundColor: bgColor, 
      color: "white", 
      fontWeight: "bold", 
      fontSize: "0.4rem"
    }}>
      {initials}
    </div>
  );
};

export default EmailIcon;
