import React, { useState, useEffect } from "react";
import "./SchemaEditor.css";
import { Button } from "react-bootstrap";
import ConnectElements from "react-connect-elements";
import TabelModal from "../../components/TableModal/TableModal";
import SchemaTable from "../../components/SchemaTable/SchemaTable";

const SchemaEditor = () => {
  const [show, setShow] = useState(false);
  const [tableRelations, setTableRelations] = useState([]);

  useEffect(() => {
    const relations = tables
      .map((table, i) => {
        return table.relationships.map((relation) => {
          const foreignTableIndex = tables.findIndex(
            (tableObj) => tableObj.id === relation.foreign_table_id
          );
          return { from: `.element${i}`, to: `.element${foreignTableIndex}` };
        });
      })
      .flat();

    setTableRelations(relations || []);
    // Due to library issue we've to set minimum height to svg to draw line
    setTimeout(() => {
      const connectContainer = document.getElementById(
        "react-connect-elements-container"
      );
      connectContainer.childNodes[0].setAttribute(
        "style",
        "min-height: 400px !important"
      );
    }, 200);
  }, [tables]);

  return (
    <div className="main-container">
      <div className="navbar">
        <h2 className="navbar-heading">Schema Editor</h2>
        <Button variant="outline-success" onClick={() => setShow(true)}>
          <i className="fa fa-plus-circle" aria-hidden="true"></i>
          Add Entity
        </Button>
      </div>
      <div className="elements">
        <div className="elements-row">
          {tables.length > 0 &&
            React.Children.toArray(
              tables.map((table, i) => (
                <SchemaTable
                  className={`element element${i}`}
                  config={{
                    title: table.tableName,
                    fields: table.definition.columns,
                  }}
                />
              ))
            )}
          {/* <SchemaTable
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
          <div></div>
          <SchemaTable
            className="element element2"
            config={{
              title: "product",
              fields: userFields,
            }}
          /> */}
        </div>
      </div>
      <ConnectElements
        selector=".elements"
        overlay={10}
        color="#ffffff"
        elements={tableRelations}
      />
      <TabelModal show={show} setShow={setShow} />
    </div>
  );
};

export default SchemaEditor;

const tables = [
  {
    id: 3,
    schemaName: "ContactSchema",
    tableName: "contact",
    relationships: [
      {
        key: "oneToMany",
        local_table_id: 3,
        local_key: "id",
        foreign_table_id: 6,
        foreign_key: "name",
      },
    ],
    definition: {
      columns: [
        {
          name: "id",
          dataType: "bigincrements",
          modifiers: [
            {
              name: "nullable",
            },
          ],
        },
        {
          name: "name",
          dataType: "string",
        },
        {
          name: "Title",
          dataType: "string",
        },
        {
          name: "first_name",
          dataType: "string",
          length: "100",
        },
        {
          name: "middle",
          dataType: "string",
          length: "100",
        },
        {
          name: "last_name",
          dataType: "string",
          length: "100",
        },
        {
          name: "email",
          dataType: "string",
          length: "30",
        },
        {
          name: "gender",
          dataType: "boolean",
        },
        {
          name: "occupation",
          dataType: "text",
          textType: "MediumText",
        },
        {
          name: "phone",
          dataType: "integer",
        },
        {
          name: "birthday",
          dataType: "date",
        },
        {
          name: "notes",
          dataType: "text",
          textType: "LongText",
        },
        {
          name: "client_id",
          dataType: "integer",
          modifiers: [
            {
              name: "unique",
            },
          ],
        },
        {
          name: "created_at",
          dataType: "timestamp",
        },
        {
          name: "updated_at",
          dataType: "timestamp",
        },
      ],
    },
  },
  {
    id: 6,
    schemaName: "TeacherSchema",
    tableName: "teacher",
    relationships: [
      {
        key: "belongsTo",
        local_table_id: 6,
        local_key: "id",
        foreign_table_id: 3,
        foreign_key: "name",
      },
    ],
    definition: {
      columns: [
        {
          name: "id",
          dataType: "bigincrements",
          modifiers: [
            {
              name: "nullable",
            },
          ],
        },
        {
          name: "name",
          dataType: "string",
        },
        {
          name: "Title",
          dataType: "string",
        },
        {
          name: "first_name",
          dataType: "string",
          length: "100",
        },
        {
          name: "middle",
          dataType: "string",
          length: "100",
        },
        {
          name: "last_name",
          dataType: "string",
          length: "100",
        },
        {
          name: "email",
          dataType: "string",
          length: "30",
        },
        {
          name: "gender",
          dataType: "boolean",
        },
        {
          name: "occupation",
          dataType: "text",
          textType: "MediumText",
        },
        {
          name: "phone",
          dataType: "integer",
        },
        {
          name: "birthday",
          dataType: "date",
        },
        {
          name: "notes",
          dataType: "text",
          textType: "LongText",
        },
        {
          name: "client_id",
          dataType: "integer",
          modifiers: [
            {
              name: "unique",
            },
          ],
        },
        {
          name: "created_at",
          dataType: "timestamp",
        },
        {
          name: "updated_at",
          dataType: "timestamp",
        },
      ],
    },
  },
  {
    id: 11,
    schemaName: "StudentSchema",
    tableName: "student",
    relationships: [
      {
        key: "belongsTo",
        local_table_id: 11,
        local_key: "id",
        foreign_table_id: 3,
        foreign_key: "name",
      },
    ],
    definition: {
      columns: [
        {
          name: "id",
          dataType: "bigincrements",
          modifiers: [
            {
              name: "nullable",
            },
          ],
        },
        {
          name: "name",
          dataType: "string",
        },
        {
          name: "Title",
          dataType: "string",
        },
        {
          name: "first_name",
          dataType: "string",
          length: "100",
        },
        {
          name: "middle",
          dataType: "string",
          length: "100",
        },
        {
          name: "last_name",
          dataType: "string",
          length: "100",
        },
        {
          name: "email",
          dataType: "string",
          length: "30",
        },
        {
          name: "gender",
          dataType: "boolean",
        },
        {
          name: "occupation",
          dataType: "text",
          textType: "MediumText",
        },
        {
          name: "phone",
          dataType: "integer",
        },
        {
          name: "birthday",
          dataType: "date",
        },
        {
          name: "notes",
          dataType: "text",
          textType: "LongText",
        },
        {
          name: "client_id",
          dataType: "integer",
          modifiers: [
            {
              name: "unique",
            },
          ],
        },
        {
          name: "created_at",
          dataType: "timestamp",
        },
        {
          name: "updated_at",
          dataType: "timestamp",
        },
      ],
    },
  },
];

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
