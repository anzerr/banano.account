'use strict';

class Seed {

	constructor(s) {
		this._seed = s || 1;
	}

	next() {
		this._seed = (this._seed * 9301 + 49297) % 233280;
		return this._seed / 233280.0;
	}

	setSeed(seed) {
		this._seed = seed;
		return this;
	}

}

module.exports = (s) => {
	return new Seed(s || 1);
};
