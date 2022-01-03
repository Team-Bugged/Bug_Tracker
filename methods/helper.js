var jwt = require("jwt-simple");
var config = require("../config/dbconfig");

const getUserId = (req) => {
  var token = req.headers.authorization.split(" ")[1];
  return jwt.decode(token, config.secret);
};

const encodeToken = (id) => {
  return jwt.encode(id, config.secret);
};
module.exports = { getUserId, encodeToken };
