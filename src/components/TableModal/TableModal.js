import React from "react";
import "./TableModal.css";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faCog, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const TableModal = ({ show, setShow }) => {
  return (
    <Modal
        show={show}
        onHide={() => setShow(false)}
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
              value="Category"
            />
          </Form.Group>

          <div className="content-row">
            <Form.Group controlId="formTimeStampsCheckbox">
              <Form.Check type="checkbox" label="Has Timestamps" />
            </Form.Group>
            <Form.Group controlId="formSoftDeletesCheckbox" className="soft-delete-checkbox">
              <Form.Check type="checkbox" label="Uses Soft-Deletes" />
            </Form.Group>
          </div>

          <h2 className="section-title">Fields</h2>
          <Row className="field-input-row">
            <Col>
              <Form.Control placeholder="Field Name" />
            </Col>
            <Col>
                <Form.Control as="select">
                  <option>Big Increments</option>
                  <option>String</option>
                  <option>Integer</option>
                  <option>Float</option>
                  <option>Double</option>
                  <option>Boolean</option>
                </Form.Control>
            </Col>
            <Col className="field-options">
              <b className="null-option">N</b>
              <FontAwesomeIcon icon={faCog} className="setting-icon" />
              <FontAwesomeIcon icon={faTrashAlt} className="delete-icon" />
            </Col>
          </Row>
          <br />
          <Row className="field-input-row">
            <Col>
              <Form.Control placeholder="Field Name" />
            </Col>
            <Col>
                <Form.Control as="select">
                  <option>Big Increments</option>
                  <option>String</option>
                  <option>Integer</option>
                  <option>Float</option>
                  <option>Double</option>
                  <option>Boolean</option>
                </Form.Control>
            </Col>
            <Col className="field-options">
              <b className="null-option">N</b>
              <FontAwesomeIcon icon={faCog} className="setting-icon" />
              <FontAwesomeIcon icon={faTrashAlt} className="delete-icon" />
            </Col>
          </Row>
          <div className="primary-color add-title">
            <FontAwesomeIcon icon={faPlusCircle} />
            <span> Add Field</span>
          </div>

          <h2 className="section-title">Relationships</h2>

          <h3>products()</h3>
          
          <hr className="line-breaker" />

          <div className="primary-color add-title">
            <FontAwesomeIcon icon={faPlusCircle} />
            <span> Add Relationships</span>
          </div>
        </Form>
      </Modal>
  )
}

export default TableModal;