import React from "react";
import { Form } from "react-bootstrap";
import { RELATIONSHIPS } from "../../contants/Relationships";

export const RelationshipDropdown = ({ relationship, onSelect, readOnly }) => {
  return (
    <Form.Control
      as="select"
      value={relationship.key || ""}
      onChange={(e) => onSelect(e.target.value)}
    >
      {readOnly ? (
        <option value="" disabled selected>
          {relationship.key}
        </option>
      ) : (
        <>
          <option value="">Choose relation</option>
          {React.Children.toArray(
            Object.entries(RELATIONSHIPS).map(([key, value]) => (
              <option value={key}>{value}</option>
            ))
          )}
        </>
      )}
    </Form.Control>
  );
};
