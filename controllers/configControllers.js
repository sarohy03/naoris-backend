const config = require("../config/config");

exports.getConfig = (req, res) => {
  res.status(200).json(config);
};
