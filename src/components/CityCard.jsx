import React from 'react';
import './CityCard.css';

const CityCard = ({ location, temperature, onClick }) => {
  return (
    <div className="city-block" onClick={onClick}>
      <p className="city-name">{location}</p>
      <p className="city-temp">{temperature}</p>
    </div>
  );
};

export default CityCard;