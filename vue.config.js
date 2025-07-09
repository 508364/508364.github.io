module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      css: {
        modules: false
      }
    }
  }
}