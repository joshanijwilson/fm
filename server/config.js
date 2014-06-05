module.exports = {
  mysql: {
    debug: ['ComQueryPacket', 'RowDataPacket'],
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'api',
    password        : 'api',
    database        : 'fleet_manager'
  }
};
