.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Starting image downloads...\n');
  
  for (const [filename, url] of Object.entries(images)) {
    try {
      await downloadImage(url, filename);
    } catch (error) {
      console.error(`✗ Error downloading ${filename}:`, error.message);
    }
  }
  
  console.log('\nDownload complete!');
}

downloadAll();
eject) => {
    const filePath = path.join(outputDir, filename);
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fsir-Id=K2HSFNDJXOU9YS&Signature=fdj-feX5AXaE-Rw2CH~YK6QsEjwPX2Yd-HaWjZuW-V~Pb0h1l-MNR3b9r3HCh6VHU-5m5ZZxZwXXidOeboH3fSRC0jcU3NW7uAMWY8Y2aBOyW-2JAnnGcyQ6yz~MOIpt3ooGZk6vWZT7tbpTpk8u9qmehJGmL~almwE5n5G2TZof6JAH6zgv4uBg04khyvrj3JGFpMvCvFFw-DWesvSRa283HKn32YSpDzhFQdVemy2K-RAwkBYn4Sz3Bb1e6YQqrxPwHPrvr24d98E4nQHULpZn5kkgM60dLQQorgW1wmGZNGYdktVuAbJtWOZZ5J~UQ09S6aXCaPRzhhrXhwo9hg__',
};

const outputDir = path.join(__dirname, 'public', 'images');

function downloadImage(url, filename) {
  return new Promise((resolve, r=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvR3VsQWIyUlNFd2hkRk1kMmVLZ0hUNy9zYW5kYm94L0w0WjVnY0ZHdkozY0VDdDhaRjgyWVAtaW1nLTRfMTc3MjE0MzEwMDAwMF9uYTFmbl9jM1ZpZFhKaVlXNHRZV2x5Y0c5eWRDMXdhV05yZFhBLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pa9w0RKCIsb8wpIH2BqifxOfZFdhirSjqBcUxYcUxHJL7FJ5cyEpjWl8u~YiWyj~WUEPGcX2dYU8fl0RJrhtsJVkPx2s3Mc4ZmK9W~FOOTg~apNNMMcSBOa79tWwCJpgbOC9ExrgHUuNvC4MrXlJKBXE3pGhM15zzhSSWVfOqvb8QpN7eAunQcnz15ZR70rYkF5z1obUsQzmAHLkb9D2I3vavnJV4DlFCB5AlAEvPsKZKfwZ5In7h0QEkuJQHE6DMymHoFaSI~1oydOdIs8vS-0E5Hl77OLlwnfEQxnNDugV9IUB4g__',
  'grid-airport.jpg': 'https://private-us-east-1.manuscdn.com/sessionFile/GulAb2RSEwhdFMd2eKgHT7/sandbox/L4Z5gcFGvJ3cECt8ZF82YP-img-4_1772143100000_na1fn_c3VidXJiYW4tYWlycG9ydC1waWNrdXA.jpg?x-oss-processeU1ESTJMV1Z6WTJGc1lXUmxMVzVsZHcuanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=WNknxnu9~ifQ6KYHR7rMXcEtpFbpzDd-XM9pfVId=K2HSFNDJXOU9YS',
  'hero.jpg': 'https://private-us-east-1.manuscdn.com/sessionFile/GulAb2RSEwhdFMd2eKgHT7/sandbox/L4Z5gcFGvJ3cECt8ZF82YP-img-1_1772143094000_na1fn_aGVyby0yMDI2LWVzY2FsYWRlLW5ldw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvR3VsQWIyUlNFd2hkRk1kMmVLZ0hUNy9zYW5kYm94L0w0WjVnY0ZHdkozY0VDdDhaRjgyWVAtaW1nLTFfMTc3MjE0MzA5NDAwMF9uYTFmbl9hR1Z5Ynkwes = {
  'logo.png': 'https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663383946852/JZGDQCSRuzOrAnVb.png?Expires=1803678240&Signature=TnwBNKYxvTQnyFjBiLafO7oIHhMm4izUk8sXaqOF9UykvCV8RkoyakxC0wvmYpOlzLBK4NIVOZnAi7lUGSHm--gPS1TYip4oAgaTr9TXf2NhgbLZ6Xnby~TnL3ZYxCKIxt63oGr3nEzfMMnHFIFkhmB8EziOB31RvsvbdJ9Zg9zNJBgC541Mn0NkCfkosiPVQcvQKtiGgkwyPLX-S93mH5aIlOVIzUX8w85yCT6ji46EQE1uPRJBiH4AUf4LE9F8J6Pd1ekmHpKGPbFsvQwXgzU5mhfER2BSN6HvOffez3sS9utCcSwwRZkWSbm8KO7eEMeVDB6ByGj-qCfjph536g__&Key-Pair-const https = require('https');
const fs = require('fs');
const path = require('path');

const imag