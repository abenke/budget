module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      files: ['public/assets/styles/scss/*.scss'],
      tasks: ['compass:compile', 'notify:watch']
    },

    compass: {
      compile: {
        src: 'public/assets/styles/scss',
        dest: 'public/assets/styles/css',
        linecomments: false,
        forcecompile: true,
        debugsass: false,
        images: 'public/assets/images/',
        relativeassets: true
      }
    },

    notify: {
      watch: {
          options: {
              message: 'SASS and Uglify finished running'
          }
      }
    }
  });

  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
};