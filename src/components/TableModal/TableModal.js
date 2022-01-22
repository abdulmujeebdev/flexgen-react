import React, { useState, useRef } from "react";
import "./TableModal.css";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faCog,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { DATA_TYPES } from "../../contants/ColumnTypes";
import { RELATIONSHIPS } from "../../contants/Relationships";

const TableModal = ({
  setShowTableModal,
  onSubmit,
  tables,
  selectedTable,
}) => {
  const tableId = useRef(selectedTable.id || Math.floor(Math.random() * 1000));
  const initialRelationData = {
    local_table_id: tableId.current,
    local_key: "id",
  };
  const [modalName, setModalName] = useState(selectedTable.schemaName || "");
  const [columns, setColumns] = useState(
    selectedTable.definition?.columns || [{}]
  );
  const [relationships, setRelationships] = useState(
    selectedTable.relationships || [initialRelationData]
  );

  // Column functions

  const updateColumn = (value, index, field) => {
    columns[index][field] = value;
    console.log({ value, index, field, columns });
    setColumns([...columns]);
  };

  const addColumn = () => {
    setColumns([...columns, {}]);
  };

  const deleteColumn = (index) => {
    if (columns.length < 1) {
      alert("can't delete all columns");
      return;
    }
    const updatedColumns = columns.filter((column, i) => i !== index);
    setColumns(updatedColumns);
  };

  const addNullModifierToColumn = (index) => {
    if (!columns[index].modifiers) {
      columns[index].modifiers = [];
    }
    const nullableObjIndex = columns[index].modifiers.findIndex(
      (modifier) => modifier.name === "nullable"
    );
    if (nullableObjIndex !== -1) {
      columns[index].modifiers.splice(nullableObjIndex, 1);
    } else {
      columns[index].modifiers.push({
        name: "nullable",
      });
    }
    setColumns([...columns]);
  };

  // Relation ship functions

  const updateRelationship = (value, index, field) => {
    if (!value) return;
    relationships[index][field] = value;
    setRelationships([...relationships]);
  };

  const onRelationTableSelect = (tableName, i) => {
    updateRelationship(tableName, i, "foreign_table");
    if (!tableName) return;
    const selectedTable = tables.find(
      (table) => table.tableName === tableName
    );
    relationships[i].name = selectedTable.schemaName.toLowerCase();
    relationships[i].foreign_key =
      selectedTable.schemaName.toLowerCase() + "_id";
  };

  const deleteRelation = (index) => {
    if (relationships.length < 1) {
      alert("can't delete all relationships");
      return;
    }
    const updatedRelationships = relationships.filter(
      (relationship, i) => i !== index
    );
    setRelationships(updatedRelationships);
  };

  const addRelation = () => {
    setRelationships([...relationships, { ...initialRelationData }]);
  };

  const submitTable = () => {
    if (modalName.length === 0) {
      alert("Modal name is required");
      return;
    }

    let foundError = false;
    columns.every((column) => {
      if (!column.name || !column.dataType) {
        foundError = true;
        return false;
      }
      return true;
    });

    if (foundError) {
      alert("Can't submit empty column");
      return;
    }

    const allRelationships = relationships.filter(
      (relationship) => !!relationship.foreign_table && !!relationship.key
    );
    const data = {
      id: tableId.current,
      schemaName: modalName[0].toUpperCase() + modalName.slice(1),
      tableName: modalName.toLocaleLowerCase() + 's',
      relationships: allRelationships,
      definition: {
        columns,
      },
    };
    console.log(data);
    onSubmit(data);
  };

  return (
    <Modal
      show={true}
      onHide={() => setShowTableModal(false)}
      dialogClassName="modal-90w modal-container"
    >
      <h1>Entity Options</h1>
      <h5>Category, Collection: Categories, Table: catogries</h5>
      <FontAwesomeIcon icon={faTrashAlt} className="delete-icon delete-table cursor-pointer" />

      <br />
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Modal Name"
            value={modalName}
            onChange={(e) => setModalName(e.target.value)}
          />
        </Form.Group>

        <div className="content-row">
          <Form.Group controlId="formTimeStampsCheckbox">
            <Form.Check type="checkbox" label="Has Timestamps" />
          </Form.Group>
          <Form.Group
            controlId="formSoftDeletesCheckbox"
            className="soft-delete-checkbox"
          >
            <Form.Check type="checkbox" label="Uses Soft-Deletes" />
          </Form.Group>
        </div>

        <h2 className="section-title">Fields</h2>
        {React.Children.toArray(
          columns.map((column, i) => (
            <>
              <Row className="field-input-row">
                <Col>
                  <Form.Control
                    placeholder="Field Name"
                    value={column.name || ""}
                    onChange={(e) => updateColumn(e.target.value, i, "name")}
                  />
                </Col>
                <Col>
                  <Form.Control
                    as="select"
                    value={column.dataType || ""}
                    onChange={(e) => {
                      if (e.target.value) {
                        updateColumn(e.target.value, i, "dataType");
                      }
                    }}
                  >
                    <option value="">Choose data type</option>
                    {React.Children.toArray(
                      Object.entries(DATA_TYPES).map(([key, value]) => (
                        <option value={key}>{value}</option>
                      ))
                    )}
                  </Form.Control>
                </Col>
                <Col className="field-options">
                  <b
                    className={`null-option cursor-pointer ${
                      column.modifiers &&
                      column.modifiers.findIndex(
                        (obj) => obj.name === "nullable"
                      ) !== -1
                        ? "active-color"
                        : ""
                    }`}
                    onClick={() => addNullModifierToColumn(i)}
                  >
                    N
                  </b>
                  <FontAwesomeIcon icon={faCog} className="setting-icon cursor-pointer" />
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="delete-icon cursor-pointer"
                    onClick={() => deleteColumn(i)}
                  />
                </Col>
              </Row>
              <br />
            </>
          ))
        )}
        <div
          className="primary-color add-title cursor-pointer"
          onClick={addColumn}
        >
          <FontAwesomeIcon icon={faPlusCircle} />
          <span>Add Field</span>
        </div>

        <hr className="line-breaker" />

        <h2 className="section-title">Relationships</h2>

        {React.Children.toArray(
          relationships.map((relationship, i) => (
            <>
              <Row className="field-input-row">
                <Col xs={5}>
                  <Form.Control
                    as="select"
                    value={relationship.foreign_table || ""}
                    onChange={(e) => onRelationTableSelect(e.target.value, i)}
                  >
                    <option value="">Choose table</option>
                    {React.Children.toArray(
                      tables.length > 0 &&
                        tables.map((table) => (
                          <option value={table.tableName}>
                            {table.schemaName}
                          </option>
                        ))
                    )}
                  </Form.Control>
                </Col>
                <Col xs={5}>
                  <Form.Control
                    as="select"
                    value={relationship.key || ""}
                    onChange={(e) =>
                      updateRelationship(e.target.value, i, "key")
                    }
                  >
                    <option value="">Choose relation</option>
                    {React.Children.toArray(
                      Object.entries(RELATIONSHIPS).map(([key, value]) => (
                        <option value={key}>{value}</option>
                      ))
                    )}
                  </Form.Control>
                </Col>
                <Col className="field-options">
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="delete-icon cursor-pointer"
                    onClick={() => deleteRelation(i)}
                  />
                </Col>
              </Row>
              {relationship.foreign_table && relationship.key && (
                <Row className="field-input-row">
                  <Col xs={5}>
                    <span>Relationship Name</span>
                    <Form.Control
                      type="text"
                      placeholder="Enter relationship name"
                      value={relationship.name}
                      onChange={(e) =>
                        updateRelationship(e.target.value, i, "name")
                      }
                    />
                  </Col>
                  <Col xs={5}>
                    <span>Foreign Key Name</span>
                    <Form.Control
                      type="text"
                      placeholder="Enter foreign key name"
                      value={relationship.foreign_key}
                      onChange={(e) =>
                        updateRelationship(e.target.value, i, "foreign_key")
                      }
                    />
                  </Col>
                  <Col />
                </Row>
              )}
              <br />
            </>
          ))
        )}
        {/* <h3>products()</h3> */}

        <div
          className="primary-color add-title cursor-pointer"
          onClick={addRelation}
        >
          <FontAwesomeIcon icon={faPlusCircle} />
          <span> Add Relationships</span>
        </div>

        <Button variant="outline-success" onClick={() => submitTable()}>
          Save
        </Button>
      </Form>
    </Modal>
  );
};

export default TableModal;

// {
//   schemaName:"User",
//   relationships:[
//     {
//       key:'oneToOne',
//       local_key:id,
//       foreign_key:user_id,
//       foreign_table:'Post'
//     }
//   ],
//   definition: {
//         columns: [
//           {
//             name: "id",
//             dataType: "bigincrements",
//           },
//           {
//             name: "name",
//             dataType: "string",

//           },
//         ]
//       }
// },

// {
//   schemaName:"Post",
//   relationships:[
//     {
//       key:'belongsTo',
//       local_key:user_id, // id
//       foreign_key:id, // user_id
//       foreign_table:'User',
//     }
//   ],
//   definition: {
//         columns: [
//           {
//             name: "id",
//             dataType: "bigincrements",

//           },
//           {
//             name: "title",
//             dataType: "string",

//           },
//           {
//             name: "user_id",
//             dataType: "biginteger",
//           },
//         ]
// },
// },
