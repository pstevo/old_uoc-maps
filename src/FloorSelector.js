import React from 'react';

const FloorSelector = ({ floors, visible, onSelectFloor}) => {
  if (!visible) {
    return null;
  }


  return (
    <div className="fs-div">
      {floors.map(floor => (
        <button key={floor} className="fs-button" onClick={() => onSelectFloor(floor)}>
          {floor}
        </button>
      ))}
    </div>
  );
};


export default FloorSelector;