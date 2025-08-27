const { LRU } = require("./index") // your LRU lib
console.time;

// -------------------------
// Normal recursive fibonacci
// -------------------------
function fib(n) {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
}

// -------------------------
// Memoized fibonacci with LRU
// -------------------------
const fibLRU = LRU(function fibCached(n) {
  if (n <= 1) return n
  return fibLRU(n - 1) + fibLRU(n - 2)
}, 10000)

// -------------------------
// Benchmark
// -------------------------
function benchmark(fn, label, n) {
  console.time(label)
  const result = fn(n)
  console.timeEnd(label)
  return result
}

const N = 42 // big enough to show performance diff

console.log("Benchmarking fib(", N, ")...\n")

const normalResult = benchmark(fib, "Normal Fib", N)
const lruResult = benchmark(fibLRU, "LRU Fib", N)

console.log("\nResults match?", normalResult === lruResult, "Value:", lruResult)
