import nativeCrypto from 'crypto';

export default (nativeCrypto as any)['webcrypto'] as typeof crypto;
