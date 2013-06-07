module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      styles: {
        files: ['public/assets/styles/scss/*.scss'],
        tasks: ['compass:compile', 'notify:watch']
      }
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
          title: 'CSS compiled'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-notify');
};