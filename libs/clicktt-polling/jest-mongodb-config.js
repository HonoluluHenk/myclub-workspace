module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'clicktt'
    },
    binary: {
      version: '4.4.0', // Version of MongoDB
      skipMD5: true
    },
    autoStart: false
  }
};
