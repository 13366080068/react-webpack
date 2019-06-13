const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')

module.exports = {
    mode: "development",
    devtool:"cheap-module-eval-source-map",// 开发环境配置
    devtool:"cheap-module-source-map",   // 线上生成配置
    entry: ["./src/index.js"],
    output: {
        // 输出目录
        path: path.join(__dirname, "dist"),
        // 文件名称
        filename: "bundle.js"
    },
    resolve: {
        extension: ["", ".js", "jsx"],
        alias: {
            "@": path.join(__dirname, "src"),
            pages: path.join(__dirname, "src/pages"),
            router: path.join(__dirname, "src/router")
          }
    },
    optimization: {
        usedExports: true,
        splitChunks: {
            chunks: "all", // 所有的 chunks 代码公共的部分分离出来成为一个单独的文件
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader"
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // 创建style标签，并将css添加进去
                    MiniCssExtractPlugin.loader,
                    "css-loader", // 编译css
                    "postcss-loader",
                    "sass-loader" // 编译scss
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        outputPath: 'images/', // 图片输出的路径
                        limit: 10 * 1024
                    }
                }
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        option: {
                            name: '[name]-[hash:5].min.[ext]',
                            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
                            publicPath: 'fonts/',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html', // 最终创建的文件名
            template: path.join(__dirname, 'src/template.html') // 指定模版路径
        }),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new webpack.ProvidePlugin({
            $: 'jquery', // npm
            jQuery: 'jQuery' // 本地Js文件
        }),
        new webpack.DefinePlugin({
            'process.env': {
                VUEP_BASE_URL: JSON.stringify('http://localhost:9000')
            }
        }),
        // 清除无用 css
        new PurifyCSS({
            paths: glob.sync([
                // 要做 CSS Tree Shaking 的路径文件
                path.resolve(__dirname, './src/*.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
                path.resolve(__dirname, './src/*.js')
            ])
        }),
        new AddAssetHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, '../dll/jquery.dll.js') // 对应的dll文件路径
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '..', 'dll/jquery-manifest.json')
        })
    ],
    devServer: {
        hot: true,
        contentBase: path.join(__dirname, "./dist"),
        host: "0,0,0,0", // 可以使用手机访问
        port: 8080,
        historyApiFallback: true, // 该选项的作用所有的404都连接到index.html
        proxy: {
            // 代理到后端的服务地址，会拦截所有以api开头的请求地址
            "/api": "http://localhost:3000"
        }
    }
}
