'use strict';

const util = require('uint');
const blake = require('blake2b');
const nacl = require('nacl');
const seed = require('./src/seed.js');
const crypto = require('crypto');

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
			const hash = crypto.createHash('sha256').update(key).digest('hex');
			let n = 0, max = 1, cap = Math.pow(16, max);
			for (let i = 0; i < hash.length; i += max) {
				n += Math.round(parseInt(hash.substr(i, max), 16) / cap * 9) * Math.pow(10, Math.floor(i / max));
			}
			let s = seed(n);
			while (out.length < 64) {
				out += char[Math.floor(char.length * s.next())];
			}
		}
		return out;
	}
};

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
