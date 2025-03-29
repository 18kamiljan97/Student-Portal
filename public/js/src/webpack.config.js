const path = require('path');

module.exports = {
    mode: 'development', // or 'production' for production builds
    entry: './index.js', // Entry point of your React application
    output: {
        path: path.resolve(__dirname, '..'), // Output directory (public/js) - one level up from src
        filename: 'student-portal-public.js', // Output bundle file name
    },
    devtool: 'inline-source-map', // Enable source maps for easier debugging in browser
    devServer: {
        static: '../', // Serve static files from the 'public/js' directory
        port: 8080, // You can choose a different port if needed
        hot: true,  // Enable hot module replacement (HMR) for faster development
        open: true, // Automatically open browser when dev server starts
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Apply babel-loader to all .js files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'], // Use React and modern JavaScript
                    },
                },
            },
            {
                test: /\.css$/, // Apply css-loader and style-loader to .css files
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i, // Add support for images
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name][ext]', // Output images in 'public/js/assets/images'
                },
            },
        ],
    },
};