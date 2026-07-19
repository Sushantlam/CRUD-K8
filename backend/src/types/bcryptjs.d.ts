declare module 'bcryptjs' {
  export function genSalt(rounds: number): Promise<string>;
  export function hash(s: string, salt: string): Promise<string>;
  export function compare(candidate: string, hash: string): Promise<boolean>;
  const bcrypt: {
    genSalt: typeof genSalt;
    hash: typeof hash;
    compare: typeof compare;
  };
  export default bcrypt;
}
