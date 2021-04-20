import React, { useState } from "react";
import "./SchemaEditor.css";
import { Button } from "react-bootstrap";
import ConnectElements from "react-connect-elements";
import TabelModal from '../../components/TableModal/TableModal';
import SchemaTable from '../../components/SchemaTable/SchemaTable';

const SchemaEditor = () => {
  const [show, setShow] = useState(false);

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
          <SchemaTable
            className="element element3"
            config={{
              title: "category",
              fields: userFields,
            }}
          />
        </div>

        <div className="elements-row">
          <div></div>

          <SchemaTable
            className="element element2"
            config={{
              title: "product",
              fields: userFields,
            }}
          />
        </div>
      </div>
      <ConnectElements
        selector=".elements"
        overlay={10}
        color="#ffffff"
        elements={[{ from: ".element1", to: ".element2" }]}
      />
      <Button variant="primary" onClick={() => setShow(true)}>
        Custom Width Modal
      </Button>
      <TabelModal show={show} setShow={setShow} />
    </div>
  );
};

export default SchemaEditor;


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
