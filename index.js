'use strict';

const util = require('./libary/util.js');
const blake = require('./libary/blake2b.js');
const nacl = require('./libary/nacl.js');
const seed = require('./libary/seed.js');

const account = {
	getPublicAccountID: (accountPublicKeyBytes) => {
		const accountHex = util.uint8.toHex(accountPublicKeyBytes);
		const keyBytes = util.uint4.toUint8(util.hex.toUint4(accountHex));
		return [
			'ban_',
			util.uint5.toString(util.uint4.toUint5(util.hex.toUint4('0' + accountHex))),
			util.uint5.toString(util.uint4.toUint5(util.uint8.toUint4(blake.hash(keyBytes, 5).reverse())))
		].join('');
	},

	generateAccountKeyPair: (secret) => {
		return nacl.sign.keyPair.fromSecretKey(secret);
	},

	generateAccountSecretKeyBytes: (seedBytes, accountIndex) => {
		const accountBytes = util.hex.toUint8(util.dec.toHex(accountIndex, 4));
		const handle = blake.createHash({digestLength: 32});
		handle.update(seedBytes);
		handle.update(accountBytes);
		return Buffer.from(handle.digest());
	},

	padSeed: (key) => {
		let out = key.slice(0, 64);
		if (out.length < 64) {
			let char = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			let s = seed(Buffer.from(out).readUIntBE(0, out.length));
			while (out.length < 64) {
				out += char[Math.floor(char.length * s.next())];
			}
		}
		return out;
	}
};

module.exports = (key, index) => {
	let paddedSeed = account.padSeed(key);
	let secret = account.generateAccountSecretKeyBytes(util.hex.toUint8(paddedSeed), index);
	let pair = account.generateAccountKeyPair(secret);
	return {
		seed: paddedSeed,
		index: index,
		secret: secret.toString('hex'),
		pair: pair,
		public: account.getPublicAccountID(pair.publicKey)
	};
};
