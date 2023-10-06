import React from "react";

const LinkButton = ({ onClick, children }) => {
  return (
    <button
      onClick={() => onClick()}
      style={{
        background: "none",
        border: "none",
        color: "rgba(44, 110, 203, 1)",
        textDecoration: "none",
        fontSize: "1rem",
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
};

export default LinkButton;
