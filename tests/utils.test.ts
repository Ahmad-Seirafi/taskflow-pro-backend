import { msToMillis } from '../src/utils/time';

test('msToMillis converts tokens like 15m/7d/2h', () => {
  expect(msToMillis('15m')).toBe(15 * 60 * 1000);
  expect(msToMillis('7d')).toBe(7 * 24 * 60 * 60 * 1000);
  expect(msToMillis('2h')).toBe(2 * 60 * 60 * 1000);
});

test('msToMillis throws on invalid input', () => {
  expect(() => msToMillis('15x')).toThrow();
  expect(() => msToMillis('abc')).toThrow();
});
