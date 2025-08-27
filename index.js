const hashObject = require("object-hash")

/**
 * Creates a synchronous Least Recently Used (LRU) cache wrapper around a function.
 *
 * @template {(...args: any[]) => any} T
 * @param {T} fn - The function whose results should be cached.
 * @param {number} [maxSize=1000] - The maximum number of results to store in the cache.
 * @returns {(...args: Parameters<T>) => ReturnType<T>} - A wrapped function with LRU caching applied.
 *
 * @example
 * const square = LRU(x => x * x, 3);
 * console.log(square(2)); // 4 (computed)
 * console.log(square(2)); // 4 (cached)
 */
function LRU(fn, maxSize = 1000) {
  /** @type {Map<string, ReturnType<T>>} */
  let results = new Map()

  return (...args) => {
    const key = hashObject(args)

    // Move to top (most recently used)
    if (results.has(key)) {
      const value = results.get(key)
      results.delete(key)
      results.set(key, value)
      return value
    }

    // Compute result
    const result = fn(...args)
    results.set(key, result)

    // Enforce max size
    if (results.size > maxSize) {
      const oldestKey = results.keys().next().value
      results.delete(oldestKey)
    }

    return result
  }
}

/**
 * Creates an asynchronous Least Recently Used (LRU) cache wrapper around an async function.
 *
 * @template {(...args: any[]) => Promise<any>} T
 * @param {T} fn - The async function whose results should be cached.
 * @param {number} [maxSize=1000] - The maximum number of results to store in the cache.
 * @returns {(...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>} - A wrapped async function with LRU caching applied.
 *
 * @example
 * const fetchData = asyncLRU(async (url) => {
 *   const res = await fetch(url);
 *   return res.json();
 * }, 50);
 *
 * // First call: fetched from API
 * // Second call: cached
 * await fetchData("https://api.example.com/data");
 * await fetchData("https://api.example.com/data");
 */
function asyncLRU(fn, maxSize = 1000) {
  /** @type {Map<string, Awaited<ReturnType<T>>>} */
  let results = new Map()

  return async (...args) => {
    const key = hashObject(args)

    // Move to top (most recently used)
    if (results.has(key)) {
      const value = results.get(key)
      results.delete(key)
      results.set(key, value)
      return value
    }

    // Compute result
    const result = await fn(...args)
    results.set(key, result)

    // Enforce max size
    if (results.size > maxSize) {
      const oldestKey = results.keys().next().value
      results.delete(oldestKey)
    }

    return result
  }
}

module.exports = { LRU, asyncLRU }
