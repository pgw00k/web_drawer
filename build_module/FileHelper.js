const path = require('path');
const fs = require('fs');

module.exports={
	get_all_file:function get_all_file(root, op, key, result) {
		let rs = fs.readdirSync(root, op);
		let reg = new RegExp(key)
	
		for (let i = 0; i < rs.length; i++) {
			let r = rs[i];
			let fp = path.join(root, r.name);
			if (r.isFile() && reg.test(r.name)) {
				result.push(fp);
			} else if (r.isDirectory()) {
				get_all_file(fp, op, key, result);
			}
		}
	}
}