import { CoinInfo } from '../types';
import registry from './registry.json';

registry.forEach(Object.freeze);
Object.freeze(registry);

export function getCoinRegistry() {
  return registry as Array<Readonly<CoinInfo>>;
}
