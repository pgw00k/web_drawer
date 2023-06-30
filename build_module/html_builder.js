const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

const FileHelper = require('./FileHelper.js');

function get_all_html() {
	let root = path.resolve(__dirname, '../src/page');
	console.log(`Find all html template in ${root}`);
	let op = {
		withFileTypes: true,
		recursive: true
	};
	let key = "\.html";
	let results = [];
	FileHelper.get_all_file(root, op, key, results);

	let hs = [];
	for (let i = 0; i < results.length; i++) {
		let r = results[i];
		console.log(`Get Html ${r}`);
		let fileName = path.basename(r);
		let dirName = path.dirname( path.relative(root,r) );

		let htmlSetting = new HtmlWebpackPlugin({
			template: r,
			filename: path.join(dirName,fileName),
			inject: true,
			minify: true,
			chunks:[],
			templateParameters: (compilation, assets, assetTags, options) => {
				return {
					compilation,
					webpackConfig: compilation.options,
					htmlWebpackPlugin: {
						tags: {
							bodyTags: [
								//'<script src="js/liblist.js"></script>'
							]
						},
						files: assets,
						options
					},
				};
			},
		});
		
		hs.push(htmlSetting);
	}

	return hs;
}

module.exports = {
	htmls: get_all_html()
}
