import React from "react";
import Chip from "@mui/material/Chip";
import "./Cards.css";

const Cards = ({ IMG_URL, card_no, onClick }) => {
  return (
    <div
      className="card-area"
      onClick={onClick}
      style={{
        background: `url(${IMG_URL}) no-repeat center`,
        backgroundSize: "cover",
      }}
    >
      {!IMG_URL && (
        <Chip
          className="card-button"
          label="+"
          //   variant="outlined"
          color="primary"
        />
      )}
    </div>
  );
};

export default Cards;
