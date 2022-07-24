/**
 * @jest-environment jsdom
 */

import LocalStorage from '../localStorage';

const data = {
  key1: 'val1',
  key2: 'val2',
};

test('check save localStorage', () => {
  const storage = new LocalStorage();
  storage.save(data);
  expect(storage.load().key1).toBe('val1');
});
