import React from "react";
import "./SchemaTable.css";
import { DATA_TYPES } from "../../contants/ColumnTypes";

const SchemaTable = ({ index, table, setSelectedTable }) => {
  const indexToCheckMargin = index % 2 === 0 ? index : index - 1;
  let leftMargin = index > 0 ? 160 : 0;
  if (indexToCheckMargin % 4 === 0) {
    leftMargin = 0;
  }
  return (
    <div
      className={`table-container element element${index}`}
      // style={{ marginLeft: leftMargin, marginRight: -leftMargin }}
      onClick={() => setSelectedTable(table)}
    >
      <div className="table-header"></div>
      <div className="table-body">
        <h3 className="white-text table-heading">
          {table.tableName}{" "}
          <span className="table-subheading">(MODEL for {table.tableName}s)</span>
        </h3>
        {table.definition.columns.length &&
          table.definition.columns.map((column, i) => (
            <div className="field-container" key={`${column.name}${i}`}>
              <div>
                <b
                  className={`field-option ${
                    column.modifiers &&
                    column.modifiers.findIndex(
                      (obj) => obj.name === "nullable"
                    ) !== -1
                      ? "active-color"
                      : ""
                  }`}
                >
                  N
                </b>
                <span className="white-text">{column.name}</span>
              </div>
              <span className="white-text">{column.dataType}</span>
            </div>
          ))}
        <br />
        {/* Foreign key entry */}
        {/* show foreign key on belongs to relation */}
        {/* {table.relationships &&
          table.relationships.map((relationship, i) => (
            <div
              className="field-container"
              key={`${relationship.foreign_key}${i}`}
            >
              <div>
                <b className={`field-option`}>N</b>
                <span className="white-text active-color">
                  {relationship.foreign_key}
                </span>
              </div>
              <span className="white-text active-color">
                {DATA_TYPES.biginteger}
              </span>
            </div>
          ))} */}
      </div>
    </div>
  );
};

export default SchemaTable;
