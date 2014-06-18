module.exports = {
  mysql: {
    // debug: ['ComQueryPacket', 'RowDataPacket'],
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'api',
    password        : 'api',
    database        : 'fleet_manager'
  },

  smtpTransport: {
    service: 'Gmail',
    auth: {
      user: 'fleetmanager.volvo@gmail.com',
      pass: 'volvomanager'
    }
  },

  emailNotifications: {
    from: 'Fleet Manager <fleetmanager.volvo@gmail.com>',
    to: 'vojta.jina@gmail.com'
  }
};
