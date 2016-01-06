exports.pack = (obj) => {
  try {
    return Promise.resolve(JSON.stringify(obj));
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.unpack = (obj) => {
  try {
    return Promise.resolve(JSON.parse(obj));
  } catch (error) {
    return Promise.reject(error);
  }
};

// TODO: use some object validation library
exports.validate = (obj, schema) => {
  return !!obj && !!schema;
};
