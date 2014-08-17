var fs = require('fs');

module.exports = require('enb/lib/build-flow').create()
    .name('yate-includes')
    .target('target', '?.yate')
    .useFileList('yate')
    .builder(function(sourceFiles) {
        var node = this.node;

        return sourceFiles.map(function(file) {
            return 'include "' + node.relativePath(file.fullname) + '"';
        }).join('\n');
    })
    .createTech();