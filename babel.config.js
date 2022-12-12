/** @type {import('@babel/core').TransformOptions}  */
module.exports = {
  presets: [
    process.env.TYPE === 'compile' && [
      '@babel/preset-env',
      {
        targets: {
          node: 12,
        },
      },
    ],
    '@babel/preset-typescript',
  ].filter(Boolean),
};
