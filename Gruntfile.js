/**
 * Gruntfile.js
 * @author Vivian
 * @version 1.0.0
 * copyRight 2014-2015, gandxiaowei@gmail.com all rights reserved.
 */

//需要发布的文件列表
var publishFiles = [
    'bower_components/d3/d3.min.js',
    'bower_components/idangerous-swiper/dist/css/swiper.min.css',
    'bower_components/idangerous-swiper/dist/js/swiper.jquery.min.js',
    'bower_components/jquery/dist/js/jquery.min.js',
    'bower_components/requirejs/require.js',
    'components/dist/*.min.js',
    'fragment/**',
    'scripts/dist/**',
    'styles/dist/**',
    'index.html'
];

//压缩插件的Banner
var banner = '/**\n * jquery.<%=pkg.name%>.js\n * @author <%=pkg.author%>\n * @version <%=pkg.version%>\n * copyright 2014-2015, gandxiaowei@gmail.com. all rights reserved.\n */\n';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            all: ['components/dist/', 'scripts/dist', 'styles/analysis.css']
        },
        jshint: {
            all: ['components/**/*.js', '!components/dist/*.js', 'scripts/*.js']
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
                    dest: 'scripts/dist/',
                    ext: '.min.js'
                }]
            },
            plugin: {
                options: {
                    banner: banner,
                    sourceMap: true
                },
                files: {
                    'components/dist/jquery.jhss.min.js': [
                        'components/jhss/jquery.jhss.tool.js',
                        'components/jhss/jquery.jhss.chart.js',
                        'components/jhss/jquery.jhss.analysis.js',
                        'components/jhss/jquery.jhss.page.js',
                        'components/wechat/jquery.wechat.js '
                    ]
                }
            }
        },
        cssmin: {
            'styles/analysis.css': ['styles/*.css', '!styles/analysis.css']
        },
        watch: {
            build: {
                files: ['components/**', '!components/dist/**', 'styles/*.css', '!styles/analysis.css'],
                tasks: ['build']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-ssh');

    grunt.registerTask('build', ['jshint', 'clean', 'uglify', 'cssmin']);
};