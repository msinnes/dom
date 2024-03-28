const generate = require('@babel/generator').default;
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;


const config = {
  plugins: ['jsx'],
};

const gen = ast => generate(ast).code;

const process = (input, plugins) => {
  const plugin = plugins();
  const ast = parser.parse(input, config);
  traverse(ast, plugin.visitor);
  return gen(ast);
};

export { process };
