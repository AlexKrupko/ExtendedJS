module.exports = function (grunt)
{
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var comment = '/**\n\
 * ExtendedJS\n\
 *\n\
 * Small library which extend basic functionality of JavaScript\n\
 * Chrome 45+, FireFox 40+, Safari 8+, IE10+, iOS Safari 8+, Android Browser 4.4+\n\
 *\n\
 * @author    Alexander Krupko <sanych.zp@gmail.com>\n\
 * @author    Slava Krasnyansky <krasnyansky.v@gmail.com>\n\
 * @copyright 2016 Avrora Team www.avrora.team\n\
 * @license   MIT\n\
 * @tutorial  http://extendedjs.avrora.team\n\
 * @version   ' + grunt.file.readJSON('package.json').version + '\n\
 */\n';

    grunt.initConfig({
        clean: {
            options: {
                'force': true
            },
            js     : ['./dist/*']
        },

        uglify: {
            options: {
                quoteStyle: 3,
                banner: comment,
            },
            js     : {
                files: [{
                    expand: true,
                    cwd   : './dist',
                    src   : '*.js',
                    dest  : './dist',
                    ext   : '.min.js',
                    extDot: 'last'
                }]
            }
        },

        copy: {
            options: {
                process: function(content, srcpath)
                {
                    return comment + '\n' + content;
                }
            },
            js     : {
                files: [{
                    expand: true,
                    cwd   : './src',
                    src   : '*.js',
                    dest  : './dist'
                }]
            }
        },

        babel: {
            options: {
                presets: ['es2015-script'],
                plugins: ['transform-strict-mode']
            },
            files: {
                expand: true,
                cwd   : './dist',
                src   : '*.js',
                dest  : './dist'
            }
        },

        watch: {
            js: {
                files: ['./src/*.js'],
                tasks: ['build']
            }
        }

    });

    grunt.registerTask('build', ['clean', 'copy', 'babel', 'uglify']);
    grunt.registerTask('default', ['watch']);
    
};