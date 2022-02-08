import { INVERSE_RELATION } from "../contants/Relationships";

export const integrateTablesRelations = ({
  tables,
  selectedTable,
  editMode,
}) => {
  if (editMode) {
    // To delete belongsTo relationships with the modified table, because modified tables might update or delete relationship or update table name
    tables.forEach((table) => {
      table.relationships = table.relationships.filter((relationship) => {
        return !(
          Object.values(INVERSE_RELATION).includes(relationship.key) &&
          relationship.foreign_table_id === selectedTable.id
        );
      });
    });
    console.log(
      "deleted belgonsTo key from tables",
      JSON.parse(JSON.stringify(tables))
    );
  }

  selectedTable.relationships.forEach((relation) => {
    if (!Object.values(INVERSE_RELATION).includes(relation.key)) {
      const {
        // foreign_key,
        // local_key,
        // local_table_id,
        // foreign_table,
        foreign_table_id,
      } = relation;
      const table = tables.find(
        (tableObj) => +tableObj.id === +foreign_table_id
      );
      // if exist replace relationship
      table.relationships.push({
        // foreign_key,
        foreign_table: selectedTable.tableName,
        foreign_table_id: selectedTable.id,
        key: INVERSE_RELATION[relation.key],
        local_key: "id", // primary key
        local_table_id: table.id,
        name: relation.name,
        // name: tables[foreignTableIndex].tableName.slice(0, tables[foreignTableIndex].tableName.length - 1)
      });
    }
  });
};
