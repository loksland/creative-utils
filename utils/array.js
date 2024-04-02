// Usage:
// import * as utils from '@/utils.js';

/**
 * Shuffles the element order of an array.
 * @param {Array} array - Array to shuffle.
 * @example
 * let tmp = ['one','two','three'];
 * utils.shuffle(tmp);
 */
export function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
