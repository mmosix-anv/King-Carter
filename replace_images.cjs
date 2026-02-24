const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Home/index.module.scss',
  'src/pages/About/index.module.scss',
  'src/pages/ServiceDetails/index.module.scss',
  'src/pages/Membership/index.module.scss',
  'src/pages/Experience/index.module.scss'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const newContent = content.replace(/\.\.\/image\//g, '/image/');
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.error(`File not found: ${file}`);
  }
});
