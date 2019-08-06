
### `Intro`
This is a simple libary to create fast throwable banano accounts

#### `Install`
``` bash
npm install --save git+https://github.com/anzerr/banano.account.git
```

#### `Usage`
```javascript
const account = require('banano.account');

let a = account.create('test1', 0);
console.log(a);
/**
    {
        seed: 'test1VXYT32558BITRL9UTZ0LEOBX9GZ5DZTJBNBG15RGGP9NNX51TDBDQU0M25I',
        secret: '8f4c2d6edeeb9a09cbee7ddc4f031c1c360711ce841c29b67c9e095855127fee',
        public: 'ban_16ruzc1wbz1tuau36r5r1hpoccnwtnimkky35aibn3kf4mhm7nqp7i39wz9f'
    }
**/
```
