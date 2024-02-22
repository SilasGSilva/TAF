//Karma configuration file, see link for more information
//https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-coverage'),
      require('karma-spec-reporter')
    ],
    client: {
      clearContext: false //Leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [
        { type: 'html', subdir: '.' },
        { type: 'lcovonly', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml', 'spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome_without_root'],
    singleRun: false,
    customLaunchers: {
      Chrome_without_root: {
        base: 'ChromeHeadless',
        flags: ['--disable-web-security', '--disable-gpu', '--no-sandbox']
      },
      ChromeDebug: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9222'],
        debug: true
      },
    },
  });
};
