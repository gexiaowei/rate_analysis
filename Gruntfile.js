/**
 * Gruntfile.js
 * @author Vivian
 * @version 1.0.0
 * copyRight 2014-2015, gandxiaowei@gmail.com all rights reserved.
 */


//压缩插件的Banner
var banner = '/**\n * jquery.<%=pkg.name%>.js\n * @author <%=pkg.author%>\n * @version <%=pkg.version%>\n * copyright 2014-2015, gandxiaowei@gmail.com. all rights reserved.\n */\n';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['components/**/*.js', '!components/dist/*.js', 'scripts/*.js']
        },
        clean: {
            all: ['dist/']
        },
        copy: {
            bower: {
                files: [
                    {
                        expand: true,
                        src: [
                            'bower_components/d3/d3.min.js',
                            'bower_components/idangerous-swiper/dist/css/swiper.min.css',
                            'bower_components/idangerous-swiper/dist/js/swiper.jquery.min.js',
                            'bower_components/jquery/dist/jquery.min.js',
                            'bower_components/jhss.wechat/dist/jquery.wechat.min.js'
                        ],
                        dest: 'dist/'
                    }
                ]
            },
            html: {
                files: [
                    {
                        expand: true,
                        src: [
                            'test/**',
                            'fragment/**',
                            'index.html'
                        ],
                        dest: 'dist/'
                    }
                ]
            }
        },
        uglify: {
            all: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: 'scripts/',
                    src: ['*.js'],
                    dest: 'dist/scripts/'
                }]
            },
            plugin: {
                options: {
                    banner: banner,
                    sourceMap: true
                },
                files: {
                    'dist/components/jquery.jhss.min.js': [
                        'components/jhss/jquery.jhss.tool.js',
                        'components/jhss/jquery.jhss.chart.js',
                        'components/jhss/jquery.jhss.analysis.js',
                        'components/jhss/jquery.jhss.page.js'
                    ]
                }
            }
        },
        cssmin: {
            'dist/styles/analysis.css': ['styles/*.css']
        },
        imagemin: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/images/'
                }]
            }
        },
        watch: {
            plugin: {
                files: ['components/**'],
                tasks: ['uglify:plugin']
            }
        },
        secret: grunt.file.readJSON('secret.json'),
        sftp: {
            product: {
                files: {
                    "./": 'dist/**'
                },
                options: {
                    path: '<%= secret.product.path %>/<%= pkg.name %>/',
                    host: '<%= secret.product.host %>',
                    username: '<%= secret.product.username %>',
                    password: '<%= secret.product.password %>',
                    showProgress: true,
                    createDirectories: true
                }
            },
            test: {
                files: {
                    "./": 'dist/**'
                },
                options: {
                    path: '<%= secret.test.path %>/<%= pkg.name %>/',
                    host: '<%= secret.test.host %>',
                    username: '<%= secret.test.username %>',
                    password: '<%= secret.test.password %>',
                    showProgress: true,
                    createDirectories: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-ssh');

    grunt.registerTask('build', ['jshint', 'clean', 'copy', 'uglify', 'cssmin', 'imagemin']);

    grunt.registerTask('publish-test', ['build', 'sftp:test']);
    grunt.registerTask('publish-product', ['build', 'sftp:product']);
};