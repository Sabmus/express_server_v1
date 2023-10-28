const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const app = require('./app');

console.log(`currently in: ${app.get('env')} environment`);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('server running!!');
});
