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

const TableModal = ({ showTableModal, setShowTableModal, onSubmit }) => {
  const tableId = useRef(Math.floor(Math.random() * 1000));
  const initialRelationData = {
    local_table_id: tableId.current,
    local_key: "id",
    foreign_key: "name",
  };
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([{}]);
  const [relationships, setRelationships] = useState([initialRelationData]);

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
    if (tableName.length === 0) {
      alert("Table name is required");
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

    const data = {
      id: tableId.current,
      schemaName: tableName[0].toUpperCase() + tableName.slice(1) + "Schema",
      tableName: tableName.toLocaleLowerCase(),
      relationships: relationships.filter(
        (relationship) => !!relationship.foreign_table_id
      ),
      definition: {
        columns,
      },
    };
    console.log(data);
    onSubmit(data);
  };

  return (
    <Modal
      show={showTableModal}
      onHide={() => setShowTableModal(false)}
      dialogClassName="modal-90w modal-container"
    >
      <h1>Enity Options</h1>
      <h5>Category, Collection: Categories, Table: catogries</h5>
      <FontAwesomeIcon icon={faTrashAlt} className="delete-icon delete-table" />

      <br />
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter table name"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
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
                    <option>Big Increments</option>
                    <option>String</option>
                    <option>Integer</option>
                    <option>Float</option>
                    <option>Double</option>
                    <option>Boolean</option>
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
                  <FontAwesomeIcon icon={faCog} className="setting-icon" />
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

        <h2 className="section-title">Relationships</h2>

        {React.Children.toArray(
          relationships.map((relationship, i) => (
            <>
              <Row className="field-input-row">
                <Col>
                  <Form.Control
                    as="select"
                    value={relationship.foreign_table_id || ""}
                    onChange={(e) =>
                      updateRelationship(e.target.value, i, "foreign_table_id")
                    }
                  >
                    <option value="">Choose table</option>
                    <option value="3">Contact</option>
                    <option value="6">Teacher</option>
                    <option value="11">Student</option>
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Control
                    as="select"
                    value={relationship.key || ""}
                    onChange={(e) =>
                      updateRelationship(e.target.value, i, "key")
                    }
                  >
                    <option value="">Choose relation</option>
                    <option value="belongsTo">belongsTo</option>
                    <option value="oneToMany">oneToMany</option>
                    <option value="manyToMany">manyToMany</option>
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
              <br />
            </>
          ))
        )}
        {/* <h3>products()</h3> */}

        <hr className="line-breaker" />

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
