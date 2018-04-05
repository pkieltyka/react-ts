const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv')

const shared = {
  appEnvVars: (envfile, opts = { server: false }) => {
    const env = {}
    const contents = fs.readFileSync(path.join(process.cwd(), envfile))
    const vars = dotenv.parse(contents)

    Object.keys(vars).forEach((key) => {
      if (opts.server) {
        env['process.env.' + key] = `process.env.${key} || '${vars[key]}'`
      } else {
        env['process.env.' + key] = `'${vars[key]}'`
      }
    })

    return env
  },

  vendorEntry: (config) => {
    const packageJson = require('./package.json')
    const vendorDependencies = Object.keys(packageJson['dependencies'])

    const vendorModulesMinusExclusions = vendorDependencies.filter(vendorModule => {
      config.mainModules.indexOf(vendorModule) === -1 && config.modulesToExclude.indexOf(vendorModule) === -1
    })

    return vendorModulesMinusExclusions
  }
}

const main = [
  'react-hot-loader/patch',
  'webpack-dev-server/client?http://0.0.0.0:3000',
  'webpack/hot/only-dev-server',
  'whatwg-fetch',
  './src/index.tsx'
]
const vendor = shared.vendorEntry({
  mainModules: main,
  modulesToExclude: ['']
})

module.exports = {
  context: process.cwd(), // to automatically find tsconfig.json
  entry: {
    main: main,
    vendor: vendor
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: "/"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ForkTsCheckerWebpackPlugin({
      tslint: true,
      checkSyntacticErrors: true,
      watch: ['./src']
    }),
    // new webpack.DefinePlugin(shared.appEnvVars('config/app.dev.env')),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html'
    })
  ],
  module: {
    rules: [{
      test: /.tsx?$/,
      use: [{
        loader: 'ts-loader', options: { transpileOnly: true }
      }],
      exclude: path.resolve(process.cwd(), 'node_modules'),
      include: [
        path.resolve(process.cwd(), 'src')
      ]
    },{
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [{
        loader: 'url-loader', options: { limit: 8192 }
      }]
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.png', '.jpg'],
    alias: {
      src: path.join(process.cwd(), 'src')
    }
  },
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    hot: true,
    historyApiFallback: true,
    stats: 'errors-only',
    disableHostCheck: true
  }
};
