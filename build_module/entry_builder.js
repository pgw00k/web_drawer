const FileHelper = require('./FileHelper.js');
const path = require('path');
const fs = require('fs');

const fileExt="\.js";
const SearchOption={
	withFileTypes: true,
	recursive: true
};

const srcDir = path.resolve(__dirname, '../src');

function get_all_lib(entry)
{
	let root = path.resolve(__dirname, '../src/lib');
	if(!fs.existsSync(root))
	{
		console.warn(`Lib ${root} is not exist!`);
		return;
	}
	console.log(`Find all lib js in ${root}`);
	let results = [];
	FileHelper.get_all_file(root, SearchOption, fileExt, results);
	for (let i = 0; i < results.length; i++) {
		let r = results[i];
		console.log(`Get lib js ${r}`);
		let fileName = path.basename(r);
		let dirName = path.dirname( path.relative(srcDir,r) );
		
		let id = path.join(dirName,fileName).replaceAll('\\','/');
		if(!entry[id])
		{
			entry[id] = [];
		}
		entry[id].push(r);
	}
}

function get_all_page(entry)
{
	let root = path.resolve(__dirname, '../src/page');
	console.log(`Find all page js in ${root}`);
	let results = [];
	FileHelper.get_all_file(root, SearchOption, fileExt, results);
	for (let i = 0; i < results.length; i++) {
		let r = results[i];
		console.log(`Get page js ${r}`);
		let fileName = path.basename(r);
		let dirName = path.dirname( path.relative(root,r) );
		
		let id = path.join(dirName,fileName).replaceAll('\\','/');
		if(!entry[id])
		{
			entry[id] = [];
		}
		entry[id].push(r);
	}
}

function get_all_entry() {
	let entry={};
	get_all_lib(entry);
	get_all_page(entry);
	return entry;
}

module.exports={
	entries:get_all_entry()
}