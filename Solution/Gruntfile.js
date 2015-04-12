module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 
	  'TestStuffWithIoC/static/js/**/*.js', 
	  'test/**/*.js'
	  ],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
	uglify: {
		my_target: {
		  files: {
			'TestStuffWithIoC/static/js/dist/output.min.js': [
				'TestStuffWithIoC/static/js/vendor/jquery/dist/jquery.js',
				'TestStuffWithIoC/static/js/vendor/jquery-ui/jquery-ui.js',
				'TestStuffWithIoC/static/js/vendor/signalr/jquery.signalR.js',
				'TestStuffWithIoC/static/js/bullbear.js', 
				'TestStuffWithIoC/static/js/jquery.ui.touch-punch.min.js'
				]
		  }
		}
	  },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'uglify']);

};