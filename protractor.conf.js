exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  getPageTimeout: 1200000,
  allScriptsTimeout: 50000000,
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  ignoreUncaughtExceptions: true,

  specs: [
    'features/*.feature'
  ],
  cucumberOpts: {
    require: 'features/steps/*_steps.js',
    format: 'pretty',
	tags: '~@ignore'
  }
}
