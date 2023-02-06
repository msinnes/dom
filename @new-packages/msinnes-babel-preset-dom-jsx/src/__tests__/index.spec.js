const babelPresetEnv = require('@babel/preset-env');
const babelPluginSyntaxJsx = require('@babel/plugin-syntax-jsx');
const msinnesPluginDomJsx = require('@new-msinnes/babel-plugin-dom-jsx');

const preset = require('..');

describe('api', () => {
  it('should be a function', () => {
    expect(preset).toBeInstanceOf(Function);
  });

  it('should return an object', () => {
    const obj = preset();
    expect(obj.presets).toBeInstanceOf(Array);
    expect(obj.plugins).toBeInstanceOf(Array);
    expect(obj.presets).toMatchObject([[babelPresetEnv, { targets: { node: 'current' } }]]);
    expect(obj.plugins).toMatchObject([babelPluginSyntaxJsx, msinnesPluginDomJsx]);
  });
});
