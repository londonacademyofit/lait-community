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
    
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['js/*.js'],
        dest: 'js/concat/app.js',
      },
    },
    
    watch: {
      scripts: {
        files: ['sass/*.scss', 'js/*js'],
        tasks: ['sass', 'concat'],
        options: {
          spawn: false,
        },
      },
    },
  
  });

  // Load plugins for required tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s)
  grunt.registerTask('default', ['uglify', 'concat', 'sass']);

};