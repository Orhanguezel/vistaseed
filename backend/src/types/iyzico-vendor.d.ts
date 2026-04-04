/** Kayıt adı `iyzipay`; yalnızca `iyzico-sdk.ts` üzerinden kullanılır */
declare module 'iyzipay' {
  export default class Iyzico {
    constructor(options: { apiKey: string; secretKey: string; uri: string });
    checkoutFormInitialize: {
      create: (req: unknown, cb: (err: Error | null, result: unknown) => void) => void;
      retrieve: (req: unknown, cb: (err: Error | null, result: unknown) => void) => void;
    };
  }
}
