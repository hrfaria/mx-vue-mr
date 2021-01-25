module.exports = {
    devServer: {
        proxy: {
            '/maximo/oslc': {
                target: 'https://maximo-demo75.mro.com:443',
                changeOrigin: true
            },
        }
    }
}