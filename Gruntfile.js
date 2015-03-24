module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
      
    pkg: grunt.file.readJSON('package.json'),
    
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/<%= pkg.name %>.js',
        dest: 'js/min/<%= pkg.name %>.min.js'
      }
    },
    
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                'css/main.css': 'sass/main.scss'
            }
        }
    },
    
    watch: {
      scripts: {
        files: ['sass/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        },
      },
    },
  
  });

  // Load plugins for required tasks
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');

  // Default task(s)
  grunt.registerTask('default', ['uglify', 'sass']);

};