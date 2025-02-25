import { useEffect, useState } from "react"
import { BSON, EJSON, ObjectId } from "bson"
import { encode_x, u8 } from "zkjson/encoder-v2.js"
import { encode as enc, decode as dec } from "../lib/msgpack"
import { encode as enc2, decode as dec2 } from "../lib/cbor"
import { range } from "ramda"
import { Flex, Box } from "@chakra-ui/react"

function createJSON2(depth = 5, width = 5) {
  const cache = new Map()
  let stringIndex = 0
  let counter = 0
  let sequenceStart = 0
  let sequenceLength = Math.floor(Math.random() * 15) + 15
  const targetSize = 9800
  const maxSize = 10200
  let totalSize = 0

  const commonKeys = [
    "id",
    "name",
    "type",
    "value",
    "status",
    "createdAt",
    "updatedAt",
    "metadata",
    "info",
    "description",
  ]
  const commonValues = [
    "active",
    "inactive",
    "pending",
    "approved",
    "rejected",
    "processing",
    "completed",
    "error",
  ]

  function getCachedString() {
    if (Math.random() < 0.95) {
      const key = commonKeys[Math.floor(Math.random() * commonKeys.length)]
      if (!cache.has(key)) cache.set(key, stringIndex++)
      return key
    }
    return Math.random().toString(36).substring(7)
  }

  function getCommonValue() {
    return commonValues[Math.floor(Math.random() * commonValues.length)]
  }

  function getSequentialNumber() {
    if (counter - sequenceStart >= sequenceLength) {
      sequenceStart = counter
      sequenceLength = Math.floor(Math.random() * 15) + 15
    }
    return counter++
  }

  // Modified to track size better and ensure we don't exit early
  function createArray(level, remainingSize) {
    if (remainingSize <= 0) return []

    // Dynamic sizing - create smaller arrays when closer to target
    const sizeFactor = Math.min(1, remainingSize / 5000)
    const length = Math.floor((Math.random() * 100 + 50) * sizeFactor)

    const arr = []
    for (let i = 0; i < length && totalSize < maxSize; i++) {
      const element = createRandom(level - 1, remainingSize / length)
      arr.push(element)

      // Update size tracking
      const elementSize = JSON.stringify(element).length + 2 // +2 for commas and brackets
      totalSize += elementSize
      remainingSize -= elementSize

      if (totalSize >= targetSize) break
    }
    return arr
  }

  function createObject(level, remainingSize) {
    if (remainingSize <= 0) return {}

    const obj = {}
    // Dynamic sizing - create smaller objects when closer to target
    const sizeFactor = Math.min(1, remainingSize / 5000)
    const size = Math.floor((Math.random() * width + 6) * sizeFactor)
    for (let i = 0; i < size && totalSize < maxSize; i++) {
      const key = getCachedString()
      if (Math.random() < 0.8) {
        obj[key] = getCommonValue()
        totalSize += key.length + getCommonValue().length + 5 // Accounting for quotes and separator
      } else {
        const value = createRandom(level - 1, remainingSize / size)
        obj[key] = value
        totalSize += key.length + JSON.stringify(value).length + 5
      }

      if (totalSize >= targetSize) break
    }
    return obj
  }

  function createRandom(level, remainingSize) {
    if (remainingSize <= 0 || level <= 0) return getSequentialNumber()

    // When close to target size, prefer simple values to avoid overshooting
    if (remainingSize < 100) return getSequentialNumber()

    return Math.random() < 0.5
      ? createArray(level, remainingSize)
      : createObject(level, remainingSize)
  }

  let json
  let attempts = 0
  const maxAttempts = 5

  do {
    totalSize = 0
    json = createRandom(depth, targetSize)
    attempts++

    // If we're still under size but have complex structure, pad with a simple array
    if (totalSize < targetSize - 200 && attempts < maxAttempts) {
      const padding = []
      const remainingSize = targetSize - totalSize
      const paddingLength = Math.floor(remainingSize / 3)

      for (let i = 0; i < paddingLength && totalSize < targetSize; i++) {
        padding.push(counter++)
        totalSize += 3 // Rough estimate for numbers and commas
      }

      // Add padding to json if it's an object
      if (typeof json === "object" && !Array.isArray(json)) {
        json.padding = padding
      } else if (Array.isArray(json)) {
        json.push(...padding)
      }
    }
  } while (totalSize < targetSize - 500 && attempts < maxAttempts)

  return json
}
function randomPrimitive() {
  const r = Math.random()
  if (r < 0.25) return Math.floor(Math.random() * 101)
  else if (r < 0.5) return randomString(Math.floor(Math.random() * 10) + 1)
  else if (r < 0.75) return Math.random() < 0.5
  else return null
}

function randomString(length) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let s = ""
  for (let i = 0; i < length; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return s
}

function createJSON(depth = 0) {
  const maxDepth = 3
  if (depth >= maxDepth) {
    return randomPrimitive()
  }

  if (Math.random() < 0.5) {
    const numKeys = Math.floor(Math.random() * 4) + 1
    const obj = {}
    for (let i = 0; i < numKeys; i++) {
      const key = randomString(Math.floor(Math.random() * 6) + 1)
      obj[key] = createJSON(depth + 1)
    }
    return obj
  } else {
    const len = Math.floor(Math.random() * 4) + 1
    const arr = []
    for (let i = 0; i < len; i++) {
      arr.push(createJSON(depth + 1))
    }
    return arr
  }
}

function toB(uint8Array) {
  return Array.from(uint8Array)
    .map(byte => byte.toString(2).padStart(8, "0"))
    .join("")
}

let u = new u8()
export default function Home({}) {
  const [jsons, setJSONs] = useState("")
  const [zk, setZK] = useState([])
  const [msg, setMSG] = useState([])
  const [cbor, setCBOR] = useState([])
  const [bson, setBSON] = useState([])
  const [json, setJSON] = useState([])
  useEffect(() => {
    let jsons = []
    for (let i = 0; i < 10; i++) jsons.push(createJSON2())
    setJSONs(jsons)
  }, [])
  useEffect(() => {
    let _zk = []
    let _msg = []
    let _cbor = []
    let _bson = []
    let _json = []
    for (const v of jsons) {
      const encoded = encode_x(v, u)
      const zklen = encoded.length
      const encoded2 = enc(v)
      const msglen = encoded2.byteLength
      _msg.push({ len: msglen, diff: msglen - zklen })
      _zk.push({ len: zklen, rate: msglen / zklen })
      const encoded3 = enc2(v)
      const cborlen = encoded3.byteLength
      _cbor.push({ len: cborlen, diff: cborlen - zklen })
      const encoded4 = BSON.serialize(Array.isArray(v) ? { "": v } : v)
      const bsonlen = encoded4.byteLength
      _bson.push({ len: bsonlen, diff: bsonlen - zklen })
      const encoded5 = JSON.stringify(v)
      const jsonlen = encoded5.length
      _json.push({ len: jsonlen, diff: jsonlen - zklen })
    }
    setZK(_zk)
    setMSG(_msg)
    setCBOR(_cbor)
    setBSON(_bson)
    setJSON(_json)
  }, [jsons])
  return (
    <Flex justify="center" fontSize="12px">
      <Box w="1000px">
        <Flex my={2} fontSize="16px">
          <Box>zkJSON v2 Benchmark</Box>
          <Box flex={1} />
          <Box
            as="a"
            target="_blank"
            href="https://github.com/weavedb/zkjson/blob/master/docs/zkjson-v2.md"
            css={{ textDecoration: "underline" }}
          >
            Spec
          </Box>
        </Flex>
        <Flex>
          <Flex
            onClick={() => {
              let jsons = []
              for (let i = 0; i < 10; i++) jsons.push(createJSON2())
              setJSONs(jsons)
            }}
            my={4}
            px={4}
            py={2}
            css={{
              bg: "#eee",
              borderRadius: "3px",
              cursor: "pointer",
              _hover: { opacity: 0.75 },
            }}
          >
            Generate Pattened JSON
          </Flex>
          <Flex
            ml={4}
            onClick={() => {
              let jsons = []
              for (let i = 0; i < 10; i++) jsons.push(createJSON())
              setJSONs(jsons)
            }}
            my={4}
            px={4}
            py={2}
            css={{
              bg: "#eee",
              borderRadius: "3px",
              cursor: "pointer",
              _hover: { opacity: 0.75 },
            }}
          >
            Generate Random JSON
          </Flex>
        </Flex>
        <Flex mb={4}>
          <Flex w="100px" p={2} justify="flex-end">
            zkJSON
          </Flex>
          <Flex w="100px" p={2} justify="flex-end">
            MsgPack
          </Flex>
          <Flex w="100px" p={2} justify="flex-end">
            CBOR
          </Flex>
          <Flex w="100px" p={2} justify="flex-end">
            BSON
          </Flex>
          <Flex w="100px" p={2} justify="flex-end">
            JSON
          </Flex>
          <Flex w="500px" p={2} ml={6}>
            Encoded Data
          </Flex>
        </Flex>
        {range(0, zk.length).map(i => (
          <Flex p={2}>
            <Flex
              w="100px"
              px={2}
              justify="flex-end"
              align="flex-end"
              direction="column"
            >
              <Box>{zk[i].len}</Box>
              <Box fontSize="12px" color="#5137C5">
                {Math.round(zk[i].rate)}x
              </Box>
            </Flex>
            <Flex
              w="100px"
              px={2}
              justify="flex-end"
              align="flex-end"
              direction="column"
            >
              <Box>{msg[i].len}</Box>
              <Box
                fontSize="12px"
                color={msg[i].diff > 0 ? "crimson" : "#5137C5"}
              >
                {msg[i].diff < 0 ? "" : "+"}
                {msg[i].diff}
              </Box>
            </Flex>
            <Flex
              w="100px"
              px={2}
              justify="flex-end"
              align="flex-end"
              direction="column"
            >
              <Box>{cbor[i].len}</Box>
              <Box
                fontSize="12px"
                color={cbor[i].diff > 0 ? "crimson" : "#5137C5"}
              >
                {cbor[i].diff < 0 ? "" : "+"}
                {cbor[i].diff}
              </Box>
            </Flex>
            <Flex
              w="100px"
              px={2}
              justify="flex-end"
              align="flex-end"
              direction="column"
            >
              <Box>{bson[i].len}</Box>
              <Box
                fontSize="12px"
                color={bson[i].diff > 0 ? "crimson" : "#5137C5"}
              >
                {bson[i].diff < 0 ? "" : "+"}
                {bson[i].diff}
              </Box>
            </Flex>
            <Flex
              w="100px"
              px={2}
              justify="flex-end"
              align="flex-end"
              direction="column"
            >
              <Box>{json[i].len}</Box>
              <Box
                fontSize="12px"
                color={json[i].diff > 0 ? "crimson" : "#5137C5"}
              >
                {json[i].diff < 0 ? "" : "+"}
                {json[i].diff}
              </Box>
            </Flex>
            <Flex
              ml={6}
              px={2}
              w="500px"
              color="#666"
              css={{
                overflow: "hidden",
                fontSize: "10px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {JSON.stringify(jsons[i])}
            </Flex>
          </Flex>
        ))}
        <Flex mb={4}>
          <Flex w="200px" py={2} justify="flex-end" color="#5137C5">
            <u>x Times Smaller than MsgPack</u>
          </Flex>
          <Flex w="300px" py={2} justify="flex-end" color="crimson">
            <u>+Bytes Bigger than zkJSON</u>
          </Flex>
          <Flex w="500px" p={2} ml={6}></Flex>
        </Flex>
        <Box my={4}>
          <Box my={1}>
            MessagePack is a self-contained JSON encoding algorithm that
            produces the smallest encoded data sizes today.
          </Box>
          <Box my={1}>
            zkJSON beats MessagePack by far in compression rate on pattened
            JSON, sometimes resulting in more than 20x smaller sizes.
          </Box>
          <Box my={1}>
            zkJSON beats MessagePack in 90% of cases with completely randomized
            JSON, and almost ties in the rest of the cases.
          </Box>
          <Box my={1}>
            CBOR produces slightly bigger sizes than MessagePack, BSON produces
            even bigger sizes than the original JSON.
          </Box>
        </Box>
      </Box>
    </Flex>
  )
}
