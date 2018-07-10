'use strict';

const account = require('./index.js');

let debug = false;
const test = (seed, map) => {
	let a = account(seed, 0);
	if (debug) {
		console.log({
			seed: a.seed,
			secret: a.secret,
			public: a.public
		});
	}
	for (let i in map) {
		if (a[i] !== map[i]) {
			throw new Error('wrong outcome');
		}
	}
};

test('test1', {
	seed: 'test1VXYT32558BITRL9UTZ0LEOBX9GZ5DZTJBNBG15RGGP9NNX51TDBDQU0M25I',
	secret: '8f4c2d6edeeb9a09cbee7ddc4f031c1c360711ce841c29b67c9e095855127fee',
	public: 'ban_16ruzc1wbz1tuau36r5r1hpoccnwtnimkky35aibn3kf4mhm7nqp7i39wz9f'
});

test('test2', {
	seed: 'test2NPWBI73U7C6BHVYZEI84GNI6MX2MTL0L48O3PHXVE13WUTDRF77EVL4QB08',
	secret: '42414b2668645757ac2da6eb390247a1ecc659d7fa0d4e9f949cda033d5ecd07',
	public: 'ban_1epct39z8wsrn1yc4w6tswhe8yjsmz7484nrh4yx4mhopgk9xgk5ufkozzu5'
});

console.log('test are valid!');
