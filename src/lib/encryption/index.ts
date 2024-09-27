// "use server"
/**
 * @todo encrypt before passing data to client
 */
// const crypto = require('crypto');

// const encryptData = (data) => {
//   const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
//   let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   return encrypted;
// };

// // Send encrypted data in the response
// const encryptedResponse = encryptData(data);
// res.json({ data: encryptedResponse });

// // On the client-side, decrypt it when needed
// const decryptData = (encryptedData) => {
//   const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
//   let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return JSON.parse(decrypted);
// };
