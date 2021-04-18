import React, { useEffect } from "react";
import { ReactDiagram } from "gojs-react";
import "./SchemaEditor.css";

import ConnectElements from "react-connect-elements";

const SchemaEditor = () => {
  // return (
  //   <div>
  //     <div className="elements">
  //       <div className="elements-row">
  //         <div className="element element1" />
  //       </div>
  //       <div className="elements-row">
  //         <div className="element element2" />
  //       </div>
  //     </div>
  //     <ConnectElements
  //       selector=".elements"
  //       elements={[{ from: ".element1", to: ".element2" }]}
  //     />
  //   </div>
  // );
  return (
    <div>
      <div className="elements">
        <div className="elements-row">
          <SchemaTable
            className="element element1"
            config={{
              title: "user",
              fields: userFields,
            }}
          />
        </div>
        {/* <div className="elements-row"></div> */}

        <div className="elements-row">
          <div></div>

          {/* <div className="element element2" /> */}
          <SchemaTable
            className="element element2"
            config={{
              title: "product",
              fields: userFields,
            }}
          />
        </div>
        {/* <div className="elements-row"></div> */}
        <div className="elements-row">
          <SchemaTable
            className="element element3"
            config={{
              title: "category",
              fields: userFields,
            }}
          />
          <div></div>
        </div>
      </div>
      <ConnectElements
        selector=".elements"
        overlay={10}
        color="#ffffff"
        elements={[{ from: ".element1", to: ".element2" }]}
      />
    </div>
  );
};

export default SchemaEditor;

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

const userFields = [
  {
    isNullable: false,
    title: "id",
    type: "bigIncrements",
  },
  {
    isNullable: false,
    title: "name",
    type: "string",
  },
  {
    isNullable: false,
    title: "email",
    type: "string",
  },
  {
    isNullable: true,
    title: "email_verified_at",
    type: "timestamp",
  },
  {
    isNullable: false,
    title: "password",
    type: "string",
  },
  {
    isNullable: true,
    title: "remember_token",
    type: "string",
  },
  {
    isNullable: true,
    title: "created_at",
    type: "timestamp",
  },
  {
    isNullable: true,
    title: "updated_at",
    type: "timestamp",
  },
];
