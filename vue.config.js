module.exports = {
    devServer: {
        proxy: {
            '/maximo/oslc': {
                target: 'http://172.20.163.179:9080',
                changeOrigin: true
            },
        }
    }
}