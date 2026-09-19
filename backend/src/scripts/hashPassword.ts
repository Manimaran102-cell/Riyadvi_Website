import bcrypt from 'bcryptjs';

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error('Usage: npm run hash-password -- "<password of 10+ characters>"');
  process.exit(1);
}
bcrypt.hash(pw, 12).then((h) => console.log(`\nADMIN_PASSWORD_HASH=${h}\n`));
