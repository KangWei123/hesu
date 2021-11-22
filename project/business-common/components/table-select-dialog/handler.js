const propsHandler = function ({ row, col, column }) {
  if (row[col.prop] == null) {
    row[col.prop] = '';
  }
};

export default {
  propsHandler: propsHandler,
};
