module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 
	  'TestStuffWithIoC/static/js/**/*.js'
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
    jasmine: {
            all: {
                src: [
                    'TestStuffWithIoC/static/js/*.js',
                    '!TestStuffWithIoC/static/js/jquery*.js'
                ],
                options: {
                    'vendor': ['TestStuffWithIoC/static/js/vendor', 'TestStuffWithIoC/Scripts'],
                    'specs': 'TestStuffWithIoC/static/js/spec/**/*.js'
                }
            }
        },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'jasmine:all']
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'uglify']);

};