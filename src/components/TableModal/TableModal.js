import React, { useState, useRef } from "react";
import "./TableModal.css";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  // faCog,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { DATA_TYPES } from "../../contants/ColumnTypes";
import { MODIFIER } from "../../contants/ColumnModifiers";
import { RelationshipTablesDropdown } from "./RelationshipTablesDropdown";
import { RelationshipDropdown } from "./RelationshipDropdown";
import { INVERSE_RELATION } from "../../contants/Relationships";

const TableModal = ({ closeModal, onSubmit, tables, selectedTable }) => {
  const tableId = useRef(selectedTable.id || Math.floor(Math.random() * 1000));
  const initialRelationData = {
    local_table_id: tableId.current,
    local_key: "id",
  };
  const [modalName, setModalName] = useState(selectedTable.schemaName || "");
  const [columns, setColumns] = useState(
    selectedTable.definition?.columns
      ? [...selectedTable.definition?.columns]
      : [{}]
  );
  const [relationships, setRelationships] = useState(
    selectedTable.relationships
      ? [...selectedTable.relationships]
      : [initialRelationData]
  );

  // Column functions

  const updateColumn = (value, index, field) => {
    columns[index][field] = value;
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

  const addOrRemoveColumnModifier = (index, modifierValue) => {
    if (!columns[index].modifiers) {
      columns[index].modifiers = [];
    }
    const modifierIndex = columns[index].modifiers.findIndex(
      (modifierDetail) => modifierDetail.name === modifierValue
    );
    if (modifierIndex !== -1) {
      columns[index].modifiers.splice(modifierIndex, 1);
    } else {
      if (modifierValue === MODIFIER.PRIMARY) {
        for (const column of columns) {
          if (!column.modifiers || column.modifiers.length === 0) continue;
          for (const modifier of column.modifiers) {
            if (modifier.name === MODIFIER.PRIMARY) {
              alert("Primary key is already selected");
              return;
            }
          }
        }
      }
      columns[index].modifiers.push({
        name: modifierValue,
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

  const onRelationTableSelect = (tableId, i) => {
    const tableSelected = tables.find((table) => +table.id === +tableId);
    if (!tableSelected) return;
    relationships[i] = {
      name: tableSelected.schemaName.toLowerCase(),
      foreign_key: tableSelected.schemaName.toLowerCase() + "_id",
      foreign_table_id: tableSelected.id,
      foreign_table: tableSelected.tableName,
    };
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
      tableName: modalName.toLowerCase(), // + "s"
      relationships: allRelationships,
      definition: {
        columns,
      },
    };
    onSubmit(data);
  };

  return (
    <Modal
      show={true}
      onHide={closeModal}
      dialogClassName="modal-90w modal-container"
    >
      <h1>Entity Options</h1>
      <h5>Category, Collection: Categories, Table: catogries</h5>
      <FontAwesomeIcon
        icon={faTrashAlt}
        className="delete-icon delete-table cursor-pointer"
      />

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
                        (obj) => obj.name === MODIFIER.NULLABLE
                      ) !== -1
                        ? "active-color"
                        : ""
                    }`}
                    onClick={() =>
                      addOrRemoveColumnModifier(i, MODIFIER.NULLABLE)
                    }
                  >
                    N
                  </b>
                  <b
                    className={`null-option cursor-pointer ${
                      column.modifiers &&
                      column.modifiers.findIndex(
                        (obj) => obj.name === MODIFIER.PRIMARY
                      ) !== -1
                        ? "active-color"
                        : ""
                    }`}
                    onClick={() =>
                      addOrRemoveColumnModifier(i, MODIFIER.PRIMARY)
                    }
                  >
                    P
                  </b>
                  <b
                    className={`null-option cursor-pointer ${
                      column.modifiers &&
                      column.modifiers.findIndex(
                        (obj) => obj.name === MODIFIER.UNIQUE
                      ) !== -1
                        ? "active-color"
                        : ""
                    }`}
                    onClick={() =>
                      addOrRemoveColumnModifier(i, MODIFIER.UNIQUE)
                    }
                  >
                    U
                  </b>
                  {/* <FontAwesomeIcon
                    icon={faCog}
                    className="setting-icon cursor-pointer"
                  /> */}
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
          relationships.map((relationship, i) => {
            const isBelongsToRelation = Object.values(
              INVERSE_RELATION
            ).includes(relationship.key);
            return (
              <>
                <Row className="field-input-row">
                  <Col xs={5}>
                    <RelationshipTablesDropdown
                      tables={tables}
                      readOnly={isBelongsToRelation}
                      relationship={relationship}
                      relationships={relationships}
                      onSelect={(val) => onRelationTableSelect(val, i)}
                    />
                  </Col>
                  <Col xs={5}>
                    <RelationshipDropdown
                      relationship={relationship}
                      readOnly={isBelongsToRelation}
                      onSelect={(val) => updateRelationship(val, i, "key")}
                    />
                  </Col>
                  {!isBelongsToRelation && (
                    <Col className="field-options">
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="delete-icon cursor-pointer"
                        onClick={() => deleteRelation(i)}
                      />
                    </Col>
                  )}
                </Row>
                {relationship.foreign_table && relationship.key && (
                  <Row className="field-input-row">
                    <Col xs={5}>
                      <span>Relationship Name</span>
                      <Form.Control
                        type="text"
                        placeholder="Enter relationship name"
                        value={relationship.name}
                        readOnly={isBelongsToRelation}
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
                        readOnly={isBelongsToRelation}
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
            );
          })
        )}

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
