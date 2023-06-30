const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlBuilder = require('./build_module/html_builder.js');
const entryBuilder = require('./build_module/entry_builder.js');


function get_plugins()
{
	let ps = htmlBuilder.htmls;
	return ps;
}

function get_entries()
{
	let es = entryBuilder.entries;
	return es;
}

module.exports = {
	entry: get_entries(),
	output: {
		filename: '[name]',
		path: path.resolve(__dirname, 'dist')
	},
	devServer: {
		static: path.resolve(__dirname, 'dist'),
		port: 8080,
		hot: true
	},
	plugins: get_plugins(),
	
	module: {
		rules: [{
			test: /\.(scss)$/,
			use: [{
					loader: 'style-loader'
				},
				{
					loader: 'css-loader'
				},
				{
					loader: 'postcss-loader',
					options: {
						postcssOptions: {
							plugins: () => [
								require('autoprefixer')
							]
						}
					}
				},
				{
					loader: 'sass-loader'
				}
			]
		}]
	}
}
