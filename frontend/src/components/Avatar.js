import React from "react";

// Generates a consistent color per username
const getAvatarColor = (username = "") => {
  const colors = [
    "#6C63FF", "#FF6584", "#43D9A0", "#FF9F43",
    "#54A0FF", "#EE5A24", "#9B59B6", "#1ABC9C",
    "#E17055", "#74B9FF",
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Avatar — shows initials with a consistent color per user.
 */
const Avatar = ({ username = "?", size = 44, className = "" }) => {
  const initial = username.charAt(0).toUpperCase();
  const bg = getAvatarColor(username);
  const fontSize = Math.floor(size * 0.4);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize,
        color: "white",
        fontFamily: "var(--font-body)",
        letterSpacing: "0.5px",
        userSelect: "none",
      }}
    >
      {initial}
    </div>
  );
};

export default Avatar;
