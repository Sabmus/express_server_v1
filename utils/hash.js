const bcrypt = require("bcrypt");
/**
 * you can choose a bigger or smaller salt number, but be mindfull that
 * the hashing algorithm iterates: 2^saltRounds.
 * In brypt npm package, you can see the cost based on a 2GHz core:
 * rounds=8 : ~40 hashes/sec
 * rounds=9 : ~20 hashes/sec
 * rounds=10: ~10 hashes/sec
 * rounds=11: ~5  hashes/sec
 * rounds=12: 2-3 hashes/sec
 * rounds=13: ~1 sec/hash
 * rounds=14: ~1.5 sec/hash
 * rounds=15: ~3 sec/hash
 * rounds=25: ~1 hour/hash
 * rounds=31: 2-3 days/hash
 */
const saltRounds = 10;

async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, saltRounds);
}

async function checkPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  checkPassword,
};
