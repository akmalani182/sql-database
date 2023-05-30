const database = require('../config/db');

module.exports.handleConnect = async () => {
  const data = await database.promise().connect();
  return data
}
