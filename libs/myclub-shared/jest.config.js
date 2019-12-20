module.exports = {
  name: 'myclub-shared',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/myclub-shared',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
