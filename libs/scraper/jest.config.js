module.exports = {
  name: 'scraper',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/scraper',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
