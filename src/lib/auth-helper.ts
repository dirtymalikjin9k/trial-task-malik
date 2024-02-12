import crypto from 'crypto'

export function sha1(data:string) {
  const hash = crypto.createHash('sha1');
  hash.update(data);
  return hash.digest('hex');
}
