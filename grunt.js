module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      files: ['public/assets/styles/scss/*.scss'],
      tasks: ['compass:prod']
    },

    compass: {
      prod: {
        src: 'public/assets/styles/scss',
        dest: 'public/assets/styles/css',
        linecomments: false,
        forcecompile: true,
        debugsass: false,
        images: 'public/assets/images',
        relativeassets: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-requirejs');
  grunt.loadNpmTasks('grunt-compass');
  grunt.loadNpmTasks('grunt-css');
};