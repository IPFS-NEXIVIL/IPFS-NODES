module.exports = (config, env) => {
  const loaders = config.module.rules[0].oneOf;
  loaders[loaders.length - 1].exclude[1] = /\.(js|mjs|cjs|jsx|ts|tsx)$/;
  loaders.push({
    test: /\.(cjs)$/,
    exclude: /@babel(?:\/|\\{1,2})runtime/,
    loader: require.resolve("babel-loader"),
    options: {
      babelrc: false,
      configFile: false,
      compact: false,
      presets: [
        [
          require.resolve("babel-preset-react-app/dependencies"),
          { helpers: true },
        ],
      ],
      cacheDirectory: true,
      cacheCompression: false,
      sourceMaps: true,
      inputSourceMap: true,
    },
  });
  config.resolve.fallback["net"] = false;
  config.resolve.fallback["os"] = false;
  console.log(config.module.rules[0].oneOf);
  // loaders[3].test = /\.(js|mjs|cjs)$/;
  // // loaders[3].exclude.splice(0, 1);
  // // loaders[3].exclude.push(/node_modules\/.*\.(js|ts|tsx|jsx|mjs)/)
  // loaders[3].exclude[0] = /node_modules\/.*\.(?!cjs)/;
  // // console.log(loaders[3]);

  // // // config.module.
  return config;
};
