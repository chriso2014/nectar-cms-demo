const presets = [
  '@babel/preset-react',
  [
    '@babel/preset-env',
    {
      targets: {
        browsers: [
          'safari >= 9',
          'ie 11',
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'edge 15',
          'ios_saf >= 9',
          'ie_mob 11',
          'Android >= 4',
        ],
      },
    },
  ],
]

const plugins = [
  '@babel/plugin-transform-runtime',
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-transform-object-assign',
  'babel-plugin-styled-components',
]

module.exports = {
  presets,
  plugins,
}
