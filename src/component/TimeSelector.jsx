
import React from 'react';


const TimeSelector = ({ maxTime, onTimeChange, isTyping }) => {
  const times = [15, 30, 60, 120]; 

  return (
    <div className="time-selector">
      {times.map((time) => (
        <React.Fragment key={time}>
          <input
            type="radio"
            id={`time-${time}`}
            name="time-duration"
            value={time}
            checked={maxTime === time}
            onChange={(e) => onTimeChange(Number(e.target.value))}
            disabled={isTyping} 
          />
          <label htmlFor={`time-${time}`}>{time}s</label>
        </React.Fragment>
      ))}
    </div>
  );
};

export default TimeSelector;