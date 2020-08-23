module.exports = {
  name: 'export',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/export',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
