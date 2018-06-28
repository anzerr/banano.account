
### `Intro`
This is a simple libary to create fast throwable banano accounts

Install

```shell
npm install --save https://github.com/anzerr/bananoAccount.git
```

Usage
```javascript
const createAccount = require('bananoAccount');

let a = createAccount('test', 0);
console.log(a);
/**
	public: ban_3ykpjz449j9gzob7h3xycn87hgn1411cgycbcbhh8mabrbsyxpw4crqfy3rd
	seed: testHNLTNYTSLWGXH4DZ5CT08E2I4RKGJSRRMIVI2ATVFZCOFXIKYBTXHL8HBAOD
**/
```