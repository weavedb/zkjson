function createJSON(depth = 0) {
  const maxDepth = 3 // Limit depth so overall JSON size stays moderate.
  if (depth >= maxDepth) {
    return randomPrimitive()
  }

  // Randomly decide between creating an object or an array.
  if (Math.random() < 0.5) {
    // Create an object with 1 to 4 key/value pairs.
    const numKeys = Math.floor(Math.random() * 4) + 1
    const obj = {}
    for (let i = 0; i < numKeys; i++) {
      // Key length between 1 and 6 characters.
      const key = randomString(Math.floor(Math.random() * 6) + 1)
      obj[key] = createJSON(depth + 1)
    }
    return obj
  } else {
    // Create an array with 1 to 4 elements.
    const len = Math.floor(Math.random() * 4) + 1
    const arr = []
    for (let i = 0; i < len; i++) {
      arr.push(createJSON(depth + 1))
    }
    return arr
  }
}

function randomPrimitive() {
  // Return a simple primitive.
  const r = Math.random()
  if (r < 0.25) {
    // A small integer between 0 and 100.
    return Math.floor(Math.random() * 101)
  } else if (r < 0.5) {
    // A short string (length 1 to 10).
    return randomString(Math.floor(Math.random() * 10) + 1)
  } else if (r < 0.75) {
    return Math.random() < 0.5
  } else {
    return null
  }
}

function randomString(length) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let s = ""
  for (let i = 0; i < length; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return s
}
module.exports = { createJSON }
