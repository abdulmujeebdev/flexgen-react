import React, { Children } from "react";
import { Form } from "react-bootstrap";

export const RelationshipTablesDropdown = ({
  tables,
  relationships,
  relationship,
  onSelect,
  readOnly,
}) => {
  return (
    <Form.Control
      as="select"
      value={relationship.foreign_table_id || ""}
      disabled={readOnly}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="" disabled>
        Choose table
      </option>
      {Children.toArray(
        tables.length > 0 &&
          tables
            .filter(
              (table) =>
                !relationships.find(
                  (relation) =>
                    relation.foreign_table_id === table.id &&
                    relationship.foreign_table_id !== table.id
                )
            )
            .map((table) => (
              <option value={table.id}>{table.schemaName}</option>
            ))
      )}
    </Form.Control>
  );
};
