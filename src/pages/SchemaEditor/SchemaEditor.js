import React, { useState, useEffect } from "react";
import "./SchemaEditor.css";
import { Button } from "react-bootstrap";
import ConnectElements from "react-connect-elements";
import TabelModal from "../../components/TableModal/TableModal";
import SchemaTable from "../../components/SchemaTable/SchemaTable";
import { integrateTablesRelations } from "../../services/SchemaEditorUtilService";
import { INVERSE_RELATION } from "../../contants/Relationships";

const SchemaEditor = () => {
  const [showTableModal, setShowTableModal] = useState(false);
  // We have to re-render connect elements library when a relation update, it's a library bug
  const [showConnectElementsLines, setShowConnectElementsLines] =
    useState(true);
  const [tables, setTables] = useState(dummyTables);
  const [tableRelations, setTableRelations] = useState([]);
  const [selectedTable, setSelectedTable] = useState({});

  useEffect(() => {
    const allRelationships = tables
      .map((table, i) => {
        return table.relationships.map((relation) => {
          if (Object.values(INVERSE_RELATION).includes(relation.key))
            return null;
          const foreignTableIndex = tables.findIndex(
            (tableObj) => +tableObj.id === +relation.foreign_table_id
          );
          return { from: `.element${i}`, to: `.element${foreignTableIndex}` };
        });
      })
      .flat();

    const relations = [];
    allRelationships.forEach((relationship) => {
      if (relationship) {
        const index = relations.findIndex(
          (relation) =>
            relation.from === relationship.to &&
            relationship.from === relation.to
        );
        if (index === -1) {
          relations.push(relationship);
        }
      }
    });

    console.log("relations", relations);

    setTableRelations(relations || []);
    setShowConnectElementsLines(false);

    // Due to library issue we've to set minimum height to svg to draw line
    setTimeout(() => {
      setShowConnectElementsLines(true);
      const connectContainer = document.getElementById(
        "react-connect-elements-container"
      );
      if (!connectContainer) return;
      connectContainer.childNodes[0].setAttribute(
        "style",
        "min-height: 400px !important"
      );
    }, 200);
  }, [tables]);

  const addOrUpdateTable = (data) => {
    if (selectedTable.id) {
      integrateTablesRelations({ tables, selectedTable: data, editMode: true });
      const updatedTables = tables.map((table) =>
        table.id === selectedTable.id ? data : table
      );
      setTables(updatedTables);
    } else {
      integrateTablesRelations({
        tables,
        selectedTable: data,
        editMode: false,
      });

      // need to move code
      setTables([...tables, data]);
    }
    setShowTableModal(false);
    setSelectedTable({});
  };

  const publishSchema = () => {
    //   fetch('http://127.0.0.1:3333/create-migration', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       tables: tables,
    //     }),
    //   })
    //     .then((res) => res.json())
    //     .then((response) => {
    //       console.log('respnose', response)
    //     })
    //     .catch((err) => console.log('err', err))
  };

  console.log("selectedTable", selectedTable);
  console.log("tables", tables);

  return (
    <div className="main-container">
      <div className="navbar">
        <h2 className="navbar-heading">Schema Editor</h2>
        <div>
          <Button
            variant="outline-info"
            className="main-btn"
            onClick={() => {
              setShowTableModal(true);
            }}
          >
            <i className="fa fa-plus-circle" aria-hidden="true"></i>
            Add Entity
          </Button>
          <Button
            variant="outline-success"
            className="main-btn"
            onClick={publishSchema}
          >
            <i className="fas fa-download"></i>
            Download JSON
          </Button>
        </div>
      </div>
      <div className="elements">
        <div className="elements-row">
          {tables.length > 0 &&
            React.Children.toArray(
              tables.map((table, i) => (
                <SchemaTable
                  index={`${i}`}
                  table={table}
                  setSelectedTable={(table) => {
                    setSelectedTable(table);
                    setShowTableModal(true);
                  }}
                />
              ))
            )}
        </div>
      </div>
      {showConnectElementsLines && (
        <ConnectElements
          selector=".elements"
          overlay={10}
          color="#ffffff"
          elements={tableRelations}
        />
      )}
      {showTableModal && (
        <TabelModal
          tables={tables.filter((table) => table.id !== selectedTable.id)}
          selectedTable={selectedTable}
          closeModal={() => {
            setShowTableModal(false);
            setSelectedTable({});
          }}
          onSubmit={addOrUpdateTable}
        />
      )}
    </div>
  );
};

export default SchemaEditor;

const dummyTables = [
  {
    id: 658,
    schemaName: "Srudent",
    tableName: "srudent",
    relationships: [
      {
        foreign_table: "course",
        foreign_table_id: 241,
        key: "belongsTo",
        local_key: "id",
        local_table_id: 658,
        name: "srudent",
      },
      {
        foreign_table: "department",
        foreign_table_id: 792,
        key: "belongsTo",
        local_key: "id",
        local_table_id: 658,
        name: "srudent",
      },
    ],
    definition: {
      columns: [
        {
          name: "id",
          dataType: "boolean",
        },
      ],
    },
  },
  {
    id: 241,
    schemaName: "PreCourse",
    tableName: "precourse",
    relationships: [
      {
        name: "srudent",
        foreign_key: "srudent_id",
        foreign_table_id: 658,
        foreign_table: "srudent",
        key: "manyToMany",
      },
    ],
    definition: {
      columns: [
        {
          name: "id",
          dataType: "boolean",
        },
      ],
    },
  },
  {
    id: 792,
    schemaName: "Department",
    tableName: "department",
    relationships: [
      {
        name: "srudent",
        foreign_key: "srudent_id",
        foreign_table_id: 658,
        foreign_table: "srudent",
        key: "oneToMany",
      },
    ],
    definition: {
      columns: [
        {
          name: "id",
          dataType: "integer",
        },
      ],
    },
  },
];

const tablesData = [
  {
    id: 3,
    schemaName: "Contact",
    tableName: "contacts",
    relationships: [
      {
        name: "post",
        key: "oneToOne",
        local_table_id: 3,
        local_key: "id",
        foreign_table_id: 6,
        foreign_table: "posts",
        foreign_key: "post_id",
      },
      {
        name: "student",
        key: "oneToOne",
        local_table_id: 3,
        local_key: "id",
        foreign_table_id: 11,
        foreign_table: "students",
        foreign_key: "student_id",
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
    schemaName: "Post",
    tableName: "posts",
    relationships: [
      {
        name: "contact",
        key: "belongsTo",
        local_table_id: 6,
        local_key: "id",
        foreign_table_id: 3,
        foreign_table: "contacts",
        foreign_key: "contact_id",
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
    schemaName: "Student",
    tableName: "students",
    relationships: [
      {
        name: "contact",
        key: "belongsTo",
        local_table_id: 11,
        local_key: "id",
        foreign_table_id: 3,
        foreign_table: "contacts",
        foreign_key: "contact_id",
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
