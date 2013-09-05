module.exports = function (grunt) {
  grunt.initConfig({
    jasmine: {
      githubActivity: {
        src: '*.js',
        options: {
          specs: 'spec/*Spec.js',
          vendor: [ 'node_modules/mustache/mustache.js' ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', ['jasmine']);
};
