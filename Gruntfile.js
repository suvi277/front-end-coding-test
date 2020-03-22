var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
module.exports = function(grunt) {
	'use strict';
	var serveStatic = require('serve-static');
	grunt.initConfig({
		assemble: {
			site: {
				options: {
					flatten: true,
					// Templates
					partials: [ 'src/templates/includes/*.hbs' ],
					layoutdir: 'src/templates/layouts',
					layoutext: '.hbs',
					layout: 'default',
					data: [ 'src/templates/**/**/*.json' ]
				},
				src: [ 'src/templates/pages/**/*.hbs' ],
				dest: './public/'
			}
		},
		sass: {
			dist: {
				files: [
					{
						expand: true,
						cwd: 'src/styles',
						src: [ '*.scss' ],
						dest: './public/css',
						ext: '.css'
					}
				]
			}
		},
		copy: {
			assets: {
				files: [ { expand: true, cwd: 'src/assets/', src: [ '**' ], dest: 'public/img' } ]
			},
			data: {
				files: [ { expand: true, cwd: 'src/templates/includes/content/', src: [ '**' ], dest: 'public/data' } ]
			},
			scripts: {
				files: [ { expand: true, cwd: 'src/scripts', src: [ '**' ], dest: 'public/scripts' } ]
			},
			templates: {
				files: [ { expand: true, cwd: 'src/templates/includes', src: [ '**' ], dest: 'public/templates' } ]
			}
		},
		connect: {
			options: {
				livereload: true,
				port: 9001,
				base: './public/'
			},
			rules: [
				{
					from: '(^((?!css|html|js|img|fonts|hbs|/$).)*$)',
					to: '$1.html'
				}
			],
			server: {
				options: {
					middleware: function(connect, options) {
						return [ rewriteRulesSnippet, serveStatic(require('path').resolve(options.base[0])) ];
					}
				}
			}
		},
		watch: {
			pages: {
				files: [ 'src/templates/**/*.hbs' ],
				tasks: [ 'assemble:site' ]
			},
			styles: {
				files: [ 'src/styles/*.scss' ],
				tasks: [ 'sass:dist', 'copy' ]
			}
		}
	});

	grunt.loadNpmTasks('grunt-assemble');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-connect-rewrite');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('build', [ 'assemble', 'assemble:site', 'sass:dist', 'copy' ]);
	grunt.registerTask('serve', [
		'assemble',
		'assemble:site',
		'copy',
		'sass:dist',
		'configureRewriteRules',
		'connect:server',
		'watch'
	]);
};
