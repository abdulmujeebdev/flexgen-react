import React from "react";
import './SchemaTable.css';

const SchemaTable = ({ className, config }) => {
  return (
    <div className={`table-container ${className}`}>
      <div className="table-header"></div>
      <div className="table-body">
        <h3 className="white-text table-heading">
          {config.title}{" "}
          <span className="table-subheading">(MODEL for {config.title}s)</span>
        </h3>
        {config.fields.length &&
          config.fields.map((field, i) => (
            <div className="field-container" key={`${field.title}${i}`}>
              <div>
                <b
                  className={`field-option ${
                    field.isNullable ? "active-color" : ""
                  }`}
                >
                  N
                </b>
                <span className="white-text">{field.title}</span>
              </div>
              <span className="white-text">{field.type}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SchemaTable