function createConfig(plugins) {
  return {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs'
    },
    plugins: plugins || [],
  };
}

exports.createConfig = createConfig;
