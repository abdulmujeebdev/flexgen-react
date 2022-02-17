import { MODIFIER } from "../contants/ColumnModifiers";

export const toggleColumnModifier = ({ index, modifierValue, columns }) => {
  const modifierIndex = columns[index].modifiers.findIndex(
    (modifierDetail) => modifierDetail.name === modifierValue
  );
  if (modifierIndex !== -1) {
    columns[index].modifiers.splice(modifierIndex, 1);
  } else {
    if (modifierValue === MODIFIER.PRIMARY) {
      // To check before assigning primary key if modifier is nullable.
      for (const modifier of columns[index].modifiers) {
        if (modifier.name === MODIFIER.NULLABLE) {
          alert("A nullable value cannot be a primary key");
          return;
        }
      }
      //    Check if primary key is already assigned to another column
      for (const column of columns) {
        if (!column.modifiers || column.modifiers.length === 0) continue;
        for (const modifier of column.modifiers) {
          if (modifier.name === MODIFIER.PRIMARY) {
            alert("Primary key is already selected");
            return;
          }
        }
      }
    } else if (modifierValue === MODIFIER.UNIQUE) {
      // To check before assigning unique key if modifier is nullable.
      for (const modifier of columns[index].modifiers) {
        if (modifier.name === MODIFIER.NULLABLE) {
          alert("A nullable value cannot be unique key");
          return;
        }
      }
    } else if (modifierValue === MODIFIER.NULLABLE) {
      // To check before assigning nullable if modifier is primary key or unique key.
      for (const modifier of columns[index].modifiers) {
        if (modifier.name === MODIFIER.PRIMARY) {
          alert("A primary key value cannot be nullable");
          return;
        } else if (modifier.name === MODIFIER.UNIQUE) {
          alert("A unique key value cannot be nullable");
          return;
        }
      }
    }
    columns[index].modifiers.push({
      name: modifierValue,
    });
  }
  return columns;
};

export const validateTableForm = (columns) => {
  // Check if primary key exist or not
  let isPrimaryKeyFound = false;
  for (const column of columns) {
    if (
      column.modifiers &&
      column.modifiers.find((modifier) => modifier.name === MODIFIER.PRIMARY)
    ) {
      isPrimaryKeyFound = true;
      break;
    }
  }
  if (!isPrimaryKeyFound) {
    alert("No primary key found, please select any primary field");
    return false;
  }
  return true;
};
