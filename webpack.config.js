const path = require("path")


module.exports = {
    mode: "production",
    entry: {
      main: "./src/d3monitor.js",
    },
    output: {
        filename: "d3monitor-beta.min.js",
        path: path.resolve(__dirname, 'public/plugin'),
        library: 'd3monitor',
        libraryTarget: 'window',
        libraryExport: 'default'
    },
    module: {
        rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ]
    },
}