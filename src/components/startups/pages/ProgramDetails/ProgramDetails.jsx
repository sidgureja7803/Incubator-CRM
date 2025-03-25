import React from 'react';
import './ProgramDetails.css';

const ProgramDetails = ({ selectedIncubator }) => {
  if (!selectedIncubator || !selectedIncubator.programs) {
    return <div className="program-details-empty">No programs available</div>;
  }

  return (
    <div className="program-details-container">
      <h2 className="program-details-title">
        Programs for {selectedIncubator.name}
      </h2>
      <div className="programs-grid">
        {selectedIncubator.programs.map((program) => (
          <div key={program.id} className="program-card">
            <h3 className="program-name">{program.name}</h3>
            <p className="program-description">{program.description}</p>
            <div className={`program-status ${program.status.toLowerCase()}`}>
              Status: {program.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramDetails;


