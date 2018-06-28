'use strict';

const Blake2b = require('./blake2b/blake2b.js');
const util = require('./blake2b/util.js');

module.exports = {
	createHash: (options) => {
		return new Blake2b((options || {}).digestLength);
	},

	hash: function(input, length, key) {
		let handle = this.createHash({digestLength: length || 64, key: key});
		handle.update(util.normalizeInput(input));
		return handle.digest();
	},

	hex: function(input, key, length) {
		return util.toHex(this.hash(input, key, length));
	}
};
