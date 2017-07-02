module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['dao/**/*.js','routes/**/*.js','GruntFile.js','app.js','tests/**/*.js','common/**/*.js', 'websocket/**/*.js'],
      options : {
        esnext: true,
        node: true
      }
    },
    watch: {
      scripts: {
        files: ['dao/**/*.js','routes/**/*.js','GruntFile.js','app.js','tests/**/*.js','common/**/*.js', 'websocket/**/*.js'],
        tasks: ['jshint'],
        options: {
          interrupt: true,
        }
      }
    },
    nodemon: {
      dev: {
        script: 'app.js'
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  // Default task(s).
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('devMode', ['jshint','concurrent']);
};