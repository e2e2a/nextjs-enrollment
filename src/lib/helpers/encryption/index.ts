// "use server"
/**
 * @todo encrypt before passing data to client
 */
import crypto from 'crypto';
export const encryptData = (data: any, secret: any) => {
  const key = crypto.createHash('sha256').update(secret).digest(); // Hash to get a fixed-length key
  const iv = crypto.randomBytes(16); // Initialization vector
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Store the IV with the encrypted data
};

export const decryptData = (data: any, secret: any) => {
    const [ivHex, encryptedText] = data.split(':'); // Split to get IV and encrypted text
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.createHash('sha256').update(secret).digest();
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted; // Returns the decrypted string
};
