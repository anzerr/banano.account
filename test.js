'use strict';

const assert = require('assert'),
	account = require('./index.js'),
	util = require('uint'),
	aa = require('./src/account.js');

const time = (k, cd) => {
	let start = process.hrtime();
	cd();
	let end = process.hrtime(start);
	console.log(k, (((end[0] * 1e9) + end[1]) / 1e9).toFixed(3));
};

const perf = (key) => {
	let paddedSeed = null,
		secret = null,
		pair = null;
	time('padSeed', () => {
		paddedSeed = aa.padSeed(key);
	});
	time('generateAccountSecretKeyBytes', () => {
		secret = aa.generateAccountSecretKeyBytes(util.hex.toUint8(paddedSeed), 0);
	});
	time('generateAccountKeyPair', () => {
		pair = aa.generateAccountKeyPair(secret);
	});
	assert.strictEqual('8f4c2d6edeeb9a09cbee7ddc4f031c1c360711ce841c29b67c9e095855127fee', Buffer.from(pair.secretKey).toString('hex'));
	assert.strictEqual('131bfa81c4fc1ada3612607803ed552a9cd521394bc11a209a064d14df32d2f6', Buffer.from(pair.publicKey).toString('hex'));
};
for (let i = 0; i < 10; i++) {
	console.log('--- 1 ---');
	perf('test1VXYT32558BITRL9UTZ0LEOBX9GZ5DZTJBNBG15RGGP9NNX51TDBDQU0M25I');
	console.log('\n--- 2 ---');
	perf('test1');
	console.log('');
}

const test = (seed, map) => {
	let a = account.create(seed, 0);
	for (let i in map) {
		assert.strictEqual(a[i], map[i]);
	}
	let p = account.getAccountPublic(a.pair.public);
	assert.strictEqual(p, map.account);
	assert.strictEqual(account.getAccountHex(p).toString('hex'), a.pair.public);
};

test('test1', {
	seed: 'test1VXYT32558BITRL9UTZ0LEOBX9GZ5DZTJBNBG15RGGP9NNX51TDBDQU0M25I',
	secret: '8f4c2d6edeeb9a09cbee7ddc4f031c1c360711ce841c29b67c9e095855127fee',
	account: 'ban_16ruzc1wbz1tuau36r5r1hpoccnwtnimkky35aibn3kf4mhm7nqp7i39wz9f'
});

test('test2', {
	seed: 'test2NPWBI73U7C6BHVYZEI84GNI6MX2MTL0L48O3PHXVE13WUTDRF77EVL4QB08',
	secret: '42414b2668645757ac2da6eb390247a1ecc659d7fa0d4e9f949cda033d5ecd07',
	account: 'ban_1epct39z8wsrn1yc4w6tswhe8yjsmz7484nrh4yx4mhopgk9xgk5ufkozzu5'
});

try {
	account.getAccountHex('cat');
	throw new Error('failed to fail :)');
} catch(e) {
	assert.strictEqual(e.toString(), 'Error: not a valid account');
}

try {
	account.getAccountPublic('cat');
	throw new Error('failed to fail :)');
} catch(e) {
	assert.strictEqual(e.toString(), 'Error: public account has wrong length');
}

(() => {
	let hex = '30f4a3bc622ca567badc1092c41ec8b3f5510be167ed20a6087b4600357b9159',
		pub = 'ban_1e9nngy86d77eyxfr66krihejezoc67y4szf64m1iyt811tqq6csmaq7t4dp';
	assert.strictEqual(account.getAccountPublic(hex), pub);
	assert.strictEqual(account.getAccountPublic(Buffer.from(hex, 'hex')), pub);
})();

console.log('test are valid!');
