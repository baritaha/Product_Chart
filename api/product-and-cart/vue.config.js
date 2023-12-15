const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5230', // Replace with your backend API URL
        changeOrigin: true,
      },
    },
  }
})
