require! {
  "html-webpack-plugin": HtmlWebpackPlugin
  "path": path
  "webpack": webpack
}

webpackConfig = {
  devtool: "sourcemap"
  entry: {
    app: './src/index.jsx'
    vendors: [
      'react'
      'react-dom'
      'redux'
      'react-redux'
      'redux-thunk'
      '@tensorflow/tfjs'
    ]
  }
  output: {
    path: path.join(__dirname, 'build')
    filename: 'bundle.js'
  }
  plugins: [
    new HtmlWebpackPlugin {
      path: path.join(__dirname, 'build')
      template: './src/index.html'
      hash: false
      inject: 'body'
      minify: {
        collapseWhitespace: true
      }
    }
    new webpack.HotModuleReplacementPlugin!
    new webpack.NoErrorsPlugin!
    new webpack.optimize.CommonsChunkPlugin 'vendors' 'vendors.js'
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')})
  ]
  resolve:{
    alias:{
    }
    extensions: ['', '.ls', '.js', '.json', '.jsx']
  }
  module: {
    loaders: [
      {
        test: /\.js[x]?$/
        loaders: [ "react-hot", "babel" ]
        include: path.join(__dirname, 'src')
      }
      {
        test: /\.ls$/
        loaders: [ "react-hot", "livescript" ]
        include: path.join(__dirname, 'src')
      }
      {
        test: /\.json/
        loaders: [ "json" ]
        include: path.join(__dirname, 'raw')
      }
      {
        test: /\.(css|scss)$/
        loaders: [ 'style', 'css', 'sass' ]
        include: path.join(__dirname, 'css')
      }
      {
        test: /\.(png|jpg)$/
        loaders: [ 'url-loader' ]
        include: path.join(__dirname, 'image')
      }
    ]
  }
  node: {
    fs: "empty"
  }
}

module.exports = webpackConfig