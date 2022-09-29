const generate = require('@babel/generator').default;
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;


const config = {
  plugins: ['jsx'],
};

const gen = ast => generate(ast).code;
const parse = text => parser.parse(text, config);

module.exports = (input, plugins) => {
  const ast = parse(input);
  traverse(ast, plugins().visitor);
  return gen(ast);
};