export const RELATIONSHIPS = {
  oneToMany: "oneToMany",
  manyToMany: "manyToMany",
  // belongsTo: "belongsTo",
  // manyToMany:"belongsToMany",
  // oneToMany: "hasMany",
  oneToOne: "hasOne",
  // hasManyThrough: "hasManyThrough",
};

export const INVERSE_RELATION = {
  oneToMany: "belongsTo",
  manyToMany: "belongsToMany",
  oneToOne: "belongsTo",
};
