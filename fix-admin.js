const bcrypt = require('bcryptjs');
const fs = require('fs');

const hash = bcrypt.hashSync('admin123', 10);
const filePath = 'db/seed.sql';

let content = fs.readFileSync(filePath, 'utf8');
// Find the admin@ambrosia.com line and replace the hash part
const regex = /('admin@ambrosia\.com',\s*')[^']+(')/;
content = content.replace(regex, `$1${hash}$2`);

fs.writeFileSync(filePath, content);
console.log('Updated db/seed.sql with real hash:', hash);
