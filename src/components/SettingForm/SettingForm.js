import React from  'react'
import "./SettingForm.css"
import { Modal, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog
} from "@fortawesome/free-solid-svg-icons";

function SettingForm(props)
{
    return(props.trigger)?(
        
        <div className="poup" > 
          <form>
        
        <h2>  <FontAwesomeIcon 
                  icon={faCog} 
                  className="setting-icon"
                  /> Field Options</h2>
        <br/>
        <div className="content-row">
          <Form.Group >
            <Form.Check type="checkbox" label="Nullable" />
          </Form.Group>
          <Form.Group
            className="checkbox"
          >
            <Form.Check type="checkbox" label="Hidden" />
          </Form.Group>
          <Form.Group  className="checkbox">
            <Form.Check type="checkbox" label="Fillable" />
          </Form.Group>
          </div>
          <Form.Label>Indexes</Form.Label>
          <div className="content-row">
          <Form.Group>
          <Form.Check type="checkbox" label="Unique" />
          </Form.Group>
          <Form.Group  className="checkbox">
          <Form.Check type="checkbox" label="Index" />
          </Form.Group>
          </div>
          <Form.Group>
          <Form.Label>Default Value</Form.Label>
          <Form.Control
            type="default"
            placeholder="Default Value"
          />
          </Form.Group>
          <Form.Group>
          <Form.Label>Faker</Form.Label>
          <Form.Control
            type="faker"
            placeholder="Faker Code"
          />
          </Form.Group>
          <Form.Group  className="checkbox">
          <Form.Check type="checkbox" label="Primary Key" /><br/>
          <Form.Check type="checkbox" label="Foreign Key" />
          </Form.Group>
          <div>
          <Form.Group>
          <Form.Label>Reference Table/Model</Form.Label>
          <Form.Control
            type="user"
            placeholder="User"
          /><br/>
           <Form.Label>Refernce Field</Form.Label>
          <Form.Control
            type="id"
            placeholder="id"
          />
          <br/>
           <Form.Label>On Update</Form.Label>
          <Form.Control
            type="update"
            placeholder="Eg:CASCADE"
          />
          <br/>
           <Form.Label>On Delete</Form.Label>
          <Form.Control
            type="delete"
            placeholder="Eg: CASCADE"
          />
          </Form.Group> 
          </div>
        {props.children}
        </form>
    </div>
 ) : "";    
}
export default SettingForm