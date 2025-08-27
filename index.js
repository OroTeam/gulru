const hashObject = require("object-hash")

function LRU(fn, maxSize = 1000) {
  let results = new Map()

  return (...args) => {
    const key = hashObject(args)

    // Move to top
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

function asyncLRU(fn, maxSize = 1000) {
  let results = new Map()

  return async (...args) => {
    const key = hashObject(args)

    // Move to end
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
