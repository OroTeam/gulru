# GULRU

A simple **Least Recently Used (LRU) cache wrapper** for functions (both sync and async).
Caches results of expensive function calls and evicts the least recently used items when the cache is full.

---

## Features

* 🔄 Supports both **synchronous** and **asynchronous** functions
* 🗑️ Automatic eviction when cache exceeds `maxSize`
* ⚡ Huge performance boost for recursive or expensive computations
* 🪶 Lightweight, no dependencies except [`object-hash`](https://www.npmjs.com/package/object-hash)

---

## Installation

```bash
npm install gulru
```

---

## Usage

### 1. Sync Function

```js
const { LRU } = require("gulru")

// Naive Fibonacci with memoization via LRU
const fib = LRU(function f(n) {
  if (n <= 1) return n
  return f(n - 1) + f(n - 2)
}, 1000)

console.log(fib(40)) // 102334155 (fast!)
```

### 2. Async Function

```js
const { asyncLRU } = require("gulru")

// Example: fetch user data with caching
const fetchUser = asyncLRU(async (id) => {
  console.log("Fetching user from DB:", id)
  // Simulate db call
  return { id, name: "User " + id }
}, 100)

;(async () => {
  console.log(await fetchUser(1)) // Actually calls function
  console.log(await fetchUser(1)) // Instant from cache
})()
```

---

## Benchmark

We tested with Fibonacci(40):

```text
Normal Fib: ~800 ms
LRU Fib: ~2 ms
Iterative Fib: ~0.05 ms
```

✅ Results all match: **102334155**
⚡ LRU version is \~300x faster than naive recursion.

---

## When to Use

* Recursive algorithms (Fibonacci, dynamic programming problems)
* Expensive computations with repeated inputs
* API/database calls you want to cache safely

---

## License

MIT
