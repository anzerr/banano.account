'use strict';

const util = require('uint');
const account = require('./src/account.js');

module.exports = {
	create: (key, index) => {
		let paddedSeed = account.padSeed(key);
		let secret = account.generateAccountSecretKeyBytes(util.hex.toUint8(paddedSeed), index);
		let pair = account.generateAccountKeyPair(secret);
		return {
			seed: paddedSeed,
			index: index,
			secret: secret.toString('hex'),
			pair: {
				public: Buffer.from(pair.publicKey).toString('hex'),
				private: Buffer.from(pair.secretKey).toString('hex')
			},
			account: account.getPublicAccountID(pair.publicKey)
		};
	},

	getAccountPublic: (p) => {
		let pub = p instanceof Buffer ? p : Buffer.from(p, typeof p === 'string' ? 'hex' : undefined);
		if (pub.length !== 32) {
			throw new Error('public account has wrong length');
		}
		return account.getPublicAccountID(pub);
	},

	getAccountHex: (a) => {
		let p = a instanceof Buffer ? a.toString() : a;
		if (!p.match(/^ban\_[13][1-9a-z]{59}$/)) {
			throw new Error('not a valid account');
		}
		return Buffer.from(util.uint4.toHex(util.uint5.toUint4(util.string.toUint5(p.substr(4, 52)))).substr(1), 'hex');
	}
};
