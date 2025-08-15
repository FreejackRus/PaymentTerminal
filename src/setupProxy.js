const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://vodc.ru',
      changeOrigin: true,
      secure: true,
      followRedirects: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': ''
      }
    })
  );
};