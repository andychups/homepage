module.exports = function(config) {
    config.node('desktop.bundles/common');
    config.node('desktop.bundles/index');
    config.node('desktop.bundles/resume');
    config.node('desktop.bundles/works');
    config.node('desktop.bundles/blog');
    config.node('desktop.bundles/error');
    

    config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
        nodeConfig.addTechs([
            new (require('enb/techs/file-provider'))({ target: '?.bemdecl.js' }),
            new (require('enb/techs/levels'))({ levels: getLevels(config) }),
            new (require('enb/techs/deps-old'))(),
            new (require('enb/techs/files'))(),
            new (require('enb/techs/js'))(),
            new (require('enb/techs/css'))(),
            new (require('../.enb/techs/yate-includes'))()
        ]);

        nodeConfig.addTargets([
            '_?.js', '_?.css', '?.yate'
        ]);
    });

    config.mode('development', function() {
        config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
            nodeConfig.addTechs([
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.js', destTarget: '_?.js' }),
                new (require('enb/techs/file-copy'))({ sourceTarget: '?.css', destTarget: '_?.css' })
            ]);
        });
    });

    config.mode('production', function() {
        config.nodeMask(/desktop\.bundles\/.*/, function(nodeConfig) {
            nodeConfig.addTechs([
                new (require('enb/techs/borschik'))({ sourceTarget: '?.js', destTarget: '_?.js' }),
                new (require('enb/techs/borschik'))({ sourceTarget: '?.css', destTarget: '_?.css' })
            ]);
        });
    });
};

function getLevels(config) {
    return [
        'desktop.blocks'
    ].map(function(level) {
        return config.resolvePath(level);
    });
}