/**
 * Checks if an element exists in a list
 * @param {*} element
 * @param {Array} list
 * @returns {Array|false} [element, index] or false
 */
export function exists(element, list) {
  if (element && list && list.length > 0) {
    let foundAt = -1;
    for (let el of list) {
      foundAt++;
      if (el === element) return [el, foundAt];
    }
    return false;
  }
  return false;
}

/**
 * Checks if an item exists in a list using its id
 * @param {string} id
 * @param {Array} list
 * @returns {Array|false} [element, index] or false
 */
export function itemExistsById(id, list) {
  if (id && list && list.length > 0) {
    let foundAt = -1;
    for (let item of list) {
      foundAt++;
      if (item.id === id) return [item, foundAt];
    }
    return false;
  }
  return false;
}

/**
 * Chooses a random value from the list
 * @param {Array} list
 * @param {*} fallbackValue
 * @returns {*}
 */
export function getRandomValue(list, fallbackValue = null) {
  if (list && list.length > 0) {
    const randIndex = Math.floor(Math.random() * list.length);
    return list[randIndex];
  }
  return fallbackValue;
}

/**
 * Sorts array using the callback function
 * @param {Array} list
 * @param {Function} callbackFn
 * @returns {Array|false}
 */
export function sortByField(list, callbackFn) {
  if (list && list.length > 0) {
    list.sort((a, b) => callbackFn(a, b));
    return list;
  }
  return false;
}