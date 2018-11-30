'use strict';

const util = require('uint');
const blake = require('blake2b');
const nacl = require('nacl');
const seed = require('./seed.js');
const crypto = require('crypto');

const ENUM = {
	size: 64
};

class Util {

	constructor() {}

	getPublicAccountIDStart(accountPublicKeyBytes) {
		const accountHex = util.uint8.toHex(accountPublicKeyBytes);
		return util.uint5.toString(util.uint4.toUint5(util.hex.toUint4('0' + accountHex)));
	}

	getPublicAccountID(accountPublicKeyBytes, join = true) {
		const accountHex = util.uint8.toHex(accountPublicKeyBytes);
		const keyBytes = util.uint4.toUint8(util.hex.toUint4(accountHex));
		let o = [
			'ban_',
			this.getPublicAccountIDStart(accountPublicKeyBytes),
			util.uint5.toString(util.uint4.toUint5(util.uint8.toUint4(blake.hash(keyBytes, 5).reverse())))
		];
		return (join) ? o.join('') : o;
	}

	generateAccountKeyPair(secret) {
		return nacl.sign.keyPair.fromSecretKey(secret);
	}

	generateAccountSecretKeyBytes(seedBytes, accountIndex) {
		const accountBytes = util.hex.toUint8(util.dec.toHex(accountIndex, 4));
		const handle = blake.createHash({digestLength: 32});
		handle.update(seedBytes);
		handle.update(accountBytes);
		return Buffer.from(handle.digest());
	}

	toBuffer(p) {
		return p instanceof Buffer ? p : Buffer.from(p, typeof p === 'string' ? 'hex' : undefined);
	}

	padSeed(key) {
		let out = key.slice(0, ENUM.size);
		if (out.length < ENUM.size) {
			let char = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			const hash = crypto.createHash('sha256').update(out).digest('hex');
			let n = 0, max = 1, cap = Math.pow(16, max);
			for (let i = 0; i < hash.length; i += max) {
				n += Math.round(parseInt(hash.substr(i, max), 16) / cap * 9) * Math.pow(10, Math.floor(i / max));
			}
			let s = seed(n);
			while (out.length < ENUM.size) {
				out += char[Math.floor(char.length * s.next())];
			}
		}
		return out;
	}

}

module.exports = new Util();

