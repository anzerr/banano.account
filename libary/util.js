'use strict';

module.exports = {
	hex: {
		toUint4: (hexValue) => {
			const uint4 = new Uint8Array(hexValue.length);
			for (let i = 0; i < hexValue.length; i++) {
				uint4[i] = parseInt(hexValue.substr(i, 1), 16);
			}
			return uint4;
		},

		fromUint8: (uintValue) => {
			let hex = '';
			for (let i = 0; i < uintValue.length; i++) {
				let aux = uintValue[i].toString(16).toUpperCase();
				if (aux.length === 1) {
					aux = '0' + aux;
				}
				hex += aux;
				aux = '';
			}
			return hex;
		},

		toUint8: (hexValue) => {
			const length = hexValue.length / 2 | 0;
			const uint8 = new Uint8Array(length);
			for (let i = 0; i < length; i++) {
				uint8[i] = parseInt(hexValue.substr(i * 2, 2), 16);
			}
			return uint8;
		},
	},

	uint4: {
		toUint5: (uintValue) => {
			let length = uintValue.length / 5 * 4;
			let uint5 = new Uint8Array(length);
			for (let i = 1; i <= length; i++) {
				let n = i - 1;
				let m = i % 4;
				let z = n + (i - m) / 4;
				let right = uintValue[z] << m;
				let left = (length - i) % 4 === 0 ? uintValue[z - 1] << 4 : uintValue[z + 1] >> 4 - m;
				uint5[n] = (left + right) % 32;
			}
			return uint5;
		},

		toUint8: (uintValue) => {
			const length = uintValue.length / 2;
			const uint8 = new Uint8Array(length);
			for (let i = 0; i < length; i++)	{
				uint8[i] = uintValue[i * 2] * 16 + uintValue[i * 2 + 1];
			}
			return uint8;
		},

		toHex: (uint4) => {
			let hex = '';
			for (let i = 0; i < uint4.length; i++) {
				hex += uint4[i].toString(16).toUpperCase();
			}
			return hex;
		}
	},

	uint5: {
		toString: (uint5) => {
			const letterList = '13456789abcdefghijkmnopqrstuwxyz'.split('');
			let string = '';
			for (let i = 0; i < uint5.length; i++)	{
				string += letterList[uint5[i]];
			}
			return string;
		},

		toUint4: (uint5) => {
			let length = uint5.length / 4 * 5;
			let uint4 = new Uint8Array(length);
			for (let i = 1; i <= length; i++) {
				let n = i - 1;
				let m = i % 5;
				let z = n - (i - m) / 5;
				let right = uint5[z - 1] << 5 - m;
				let left = uint5[z] >> m;
				uint4[n] = (left + right) % 16;
			}
			return uint4;
		}
	},

	uint8: {
		fromHex: (hexValue) => {
			const length = hexValue.length / 2 | 0;
			const uint8 = new Uint8Array(length);
			for (let i = 0; i < length; i++) {
				uint8[i] = parseInt(hexValue.substr(i * 2, 2), 16);
			}
			return uint8;
		},

		toHex: (uintValue) => {
			let hex = '';
			for (let i = 0; i < uintValue.length; i++) {
				let aux = uintValue[i].toString(16).toUpperCase();
				if (aux.length === 1) {
					aux = '0' + aux;
				}
				hex += aux;
				aux = '';
			}
			return hex;
		},

		toUint4: (uintValue) => {
			const uint4 = new Uint8Array(uintValue.length * 2);
			for (let i = 0; i < uintValue.length; i++) {
				uint4[i * 2] = uintValue[i] / 16 | 0;
				uint4[i * 2 + 1] = uintValue[i] % 16;
			}
			return uint4;
		}
	},

	dec: {
		toHex: (decValue, bytes = null) => {
			let dec = decValue.toString().split(''), sum = [], hex = '', hexArray = [];
			while (dec.length) {
				let s = Number(dec.shift());
				for (let i = 0; s || i < sum.length; i++) {
					s += (sum[i] || 0) * 10;
					sum[i] = s % 16;
					s = (s - sum[i]) / 16;
				}
			}
			while (sum.length) {
				hexArray.push(sum.pop().toString(16));
			}

			hex = hexArray.join('');

			if (hex.length % 2 !== 0) {
				hex = '0' + hex;
			}

			if (bytes > hex.length / 2) {
				let diff = bytes - hex.length / 2;
				for (let j = 0; j < diff; j++) {
					hex = '00' + hex;
				}
			}
			return hex;
		}
	},

	string: {
		toUint5: (string) => {
			let letterList = '13456789abcdefghijkmnopqrstuwxyz'.split('');
			let length = string.length;
			let stringArray = string.split('');
			let uint5 = new Uint8Array(length);
			for (let i = 0; i < length; i++)	{
				uint5[i] = letterList.indexOf(stringArray[i]);
			}
			return uint5;
		}
	}
};
