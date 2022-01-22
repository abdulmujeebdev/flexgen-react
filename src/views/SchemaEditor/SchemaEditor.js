import React, { useState, useEffect } from "react";
import "./SchemaEditor.css";
import { Button } from "react-bootstrap";
import ConnectElements from "react-connect-elements";
import TabelModal from "../../components/TableModal/TableModal";
import SchemaTable from "../../components/SchemaTable/SchemaTable";

const SchemaEditor = () => {
  const [showTableModal, setShowTableModal] = useState(false);
  const [tables, setTables] = useState(tablesData);
  const [tableRelations, setTableRelations] = useState([]);
  const [selectedTable, setSelectedTable] = useState({});

  useEffect(() => {
    const allRelationships = tables
      .map((table, i) => {
        return table.relationships.map((relation) => {
          const foreignTableIndex = tables.findIndex(
            (tableObj) => tableObj.tableName === relation.foreign_table
          );
          return { from: `.element${i}`, to: `.element${foreignTableIndex}` };
        });
      })
      .flat();

    const relations = [];
    allRelationships.forEach((relationship) => {
      const index = relations.findIndex(
        (relation) =>
          relation.from === relationship.to && relationship.from === relation.to
      );
      if (index === -1) {
        relations.push(relationship);
      }
    });

    console.log("relations", relations);

    setTableRelations(relations || []);
    // Due to library issue we've to set minimum height to svg to draw line
    setTimeout(() => {
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
      const updatedTables = tables.map(table => table.id === selectedTable.id ? data : table);
      console.log({updatedTables});
      setTables(updatedTables);
    } else {
      // data.relationships.forEach(relation => {
      //   // if(relation.key !== 'belongsTo') {
      //     const { foreign_key, local_key, local_table_id, foreign_table } = relation;
      //     const foreignTableIndex = tables.findIndex(
      //       (tableObj) => tableObj.tableName === relation.foreign_table
      //     );
      //     tables[foreignTableIndex].relationships.push({
      //       foreign_key,
      //       foreign_table,
      //       key: "belongsTo",
      //       local_key,
      //       local_table_id,
      //       name: tables[foreignTableIndex].tableName.slice(0, tables[foreignTableIndex].tableName.length - 1)
      //     });
      //   // }
      // })
      // need to move code
      setTables([...tables, data]);
      
    }
    setShowTableModal(false);
  };

  console.log("selectedTable", selectedTable);

  return (
    <div className="main-container">
      <div className="navbar">
        <h2 className="navbar-heading">Schema Editor</h2>
        <Button
          variant="outline-success"
          onClick={() => {
            setShowTableModal(true);
            setSelectedTable({});
          }}
        >
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
      <ConnectElements
        selector=".elements"
        overlay={10}
        color="#ffffff"
        elements={tableRelations}
      />
      {showTableModal && (
        <TabelModal
          tables={tables}
          selectedTable={selectedTable}
          setShowTableModal={setShowTableModal}
          onSubmit={addOrUpdateTable}
        />
      )}
    </div>
  );
};

export default SchemaEditor;

const tablesData = [
  {
    id: 3,
    schemaName: "Contact",
    tableName: "contacts",
    relationships: [
      {
        name: 'teacher',
        key: "hasOne",
        local_table_id: 3,
        local_key: "id",
        foreign_table_id: 6,
        foreign_table: "teachers",
        foreign_key: "teacher_id",
      },
      {
        name: 'student',
        key: "hasOne",
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
    schemaName: "Teacher",
    tableName: "teachers",
    relationships: [
      {
        name: 'contact',
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
        name: 'contact',
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
