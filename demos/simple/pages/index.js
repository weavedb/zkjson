import Head from "next/head"
import Link from "next/link"
import { Select, Box, Flex, Input, Textarea } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { map } from "ramda"
import {
  encode,
  encodeVal,
  encodePath,
  decodePath,
  pad,
  toSignal,
} from "zkjson"
const snarkjs = require("snarkjs")
import { flattenPath, _encode } from "../lib/encoder"
export default function Home() {
  const [signals, setSignals] = useState(null)
  const [proof, setProof] = useState(null)
  const [result, setResult] = useState(null)
  const [type, setType] = useState("number")
  const [json, setJSON] = useState("")
  const [path, setPath] = useState("")
  const [num, setNum] = useState("")
  const [bool, setBool] = useState(true)
  const [str, setStr] = useState("")
  let valid = false
  try {
    let _j = null
    eval("_j = " + json)
    valid = true
  } catch (e) {}
  return (
    <>
      <Head>
        <title>zkJSON Demo</title>
        <meta name="description" content="Zero Knowledge Provable JSON" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex w="100%" h="100%" justify="center" p={4} fontSize="14px">
        <Box>
          <Flex align="center" justify="center" w="750px">
            <Box fontSize="30px" fontWeight="bold" color="#5037C6">
              zkJSON
            </Box>
            <Box ml={4}>Zero Knowledge Provable JSON</Box>
          </Flex>
          <Box
            w="750px"
            bg="#eee"
            py={2}
            px={8}
            mt={4}
            sx={{ borderRadius: "10px" }}
          >
            <Box align="center" mt={4} color="#5037C6">
              Using a zero knowledge circuit, you can prove any data in JSON
              without revealing the JSON itself.
            </Box>
            <Box mt={4}>
              <Flex>
                <Box as="label" color={valid ? "" : "crimson"}>
                  JSON (private, this data won't be revealed){" "}
                  {valid ? "" : "Invalid JSON"}
                </Box>
                <Box flex={1} />
                <Box
                  mr={2}
                  color="#5037C6"
                  sx={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    ":hover": { opacity: 0.75 },
                  }}
                  onClick={() => {
                    const rand = (i, start = 0) =>
                      Math.floor(Math.random() * i) + start
                    let alpha = [
                      "a",
                      "b",
                      "c",
                      "d",
                      "e",
                      "f",
                      "g",
                      "h",
                      "i",
                      "j",
                      "k",
                      "l",
                    ]
                    const getOBJ = () => {
                      let obj = {}
                      let num = rand(3) + 3
                      for (let i = 0; i < num; i++) {
                        const type = rand(6)
                        if (type === 2) {
                          obj[alpha[rand(alpha.length)]] = rand(10)
                        } else if (type === 3) {
                          obj[alpha[rand(alpha.length)]] =
                            alpha[rand(alpha.length)]
                        } else if (type === 1) {
                          obj[alpha[rand(alpha.length)]] = rand(2) === 0
                        } else if (type === 4) {
                          obj[alpha[rand(alpha.length)]] = [
                            rand(10),
                            rand(10),
                            rand(10),
                          ]
                        } else if (type === 0) {
                          obj[alpha[rand(alpha.length)]] = rand(2) === null
                        } else if (type === 5) {
                          obj[alpha[rand(alpha.length)]] = getOBJ()
                        }
                      }
                      return obj
                    }
                    setJSON(JSON.stringify(getOBJ()))
                  }}
                >
                  generate
                </Box>
              </Flex>
              <Textarea
                bg="white"
                placeholder="{ a : 1 }"
                value={json}
                onChange={e => setJSON(e.target.value)}
              />
            </Box>
            <Box mt={4}>
              <Flex>
                <Box as="label">Path (public)</Box> <Box flex={1} />
                <Box
                  mr={2}
                  color="#5037C6"
                  sx={{
                    textDecoration: "underline",
                    cursor: "pointer",
                    ":hover": { opacity: 0.75 },
                  }}
                  onClick={() => {
                    const rand = (i, start = 0) =>
                      Math.floor(Math.random() * i) + start
                    const enc = _encode(JSON.parse(json))
                    const v = enc[rand(enc.length)]
                    setPath(decodePath(flattenPath(v[0])))
                  }}
                >
                  generate
                </Box>
              </Flex>
              <Input
                bg="white"
                placeholder="a"
                value={path}
                onChange={e => setPath(e.target.value)}
              />
            </Box>
            <Box mt={4}>
              <Flex>
                <Box flex={1} pr={4}>
                  <Box as="label">Data Type (public)</Box>
                  <Select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    bg="white"
                  >
                    {map(v => <option>{v}</option>)([
                      "null",
                      "boolean",
                      "number",
                      "string",
                    ])}
                  </Select>
                </Box>
                <Box flex={1} pl={4}>
                  <Box as="label">Value (public)</Box>
                  {type === "string" ? (
                    <Input
                      placeholder="1"
                      bg="white"
                      value={str}
                      onChange={e => setStr(e.target.value)}
                    />
                  ) : type === "number" ? (
                    <Input
                      placeholder="1"
                      bg="white"
                      value={num}
                      onChange={e => {
                        if (!Number.isNaN(e.target.value * 1)) {
                          setNum(e.target.value)
                        }
                      }}
                    />
                  ) : type === "null" ? (
                    <Input
                      placeholder="1"
                      bg="white"
                      value="null"
                      disabled={true}
                    />
                  ) : (
                    <Select
                      value={bool}
                      onChange={e =>
                        setBool(e.target.value === "true" ? true : false)
                      }
                      bg="white"
                    >
                      {map(v => (
                        <option value={v === "true" ? true : false}>{v}</option>
                      ))(["true", "false"])}
                    </Select>
                  )}
                </Box>
              </Flex>
            </Box>
            <Flex justify="center" mt={4}>
              <Flex
                py={3}
                bg={valid ? "#5037C6" : "#aaa"}
                w="100%"
                justify="center"
                color="white"
                fontSize="16px"
                sx={{
                  borderRadius: "5px",
                  cursor: valid ? "pointer" : "default",
                  ":hover": { opacity: 0.75 },
                }}
                onClick={async () => {
                  if (valid) {
                    let _json = null
                    try {
                      eval("_json = " + json)
                    } catch (e) {}
                    _json = pad(toSignal(encode(_json)), 256)
                    const _path = pad(toSignal(encodePath(path)), 5)
                    let _val =
                      type === "number"
                        ? num * 1
                        : type === "string"
                        ? str
                        : type === "boolean"
                        ? bool
                        : null
                    const _val2 = pad(toSignal(encodeVal(_val)), 5)
                    const { proof, publicSignals } =
                      await snarkjs.groth16.fullProve(
                        { json: _json, path: _path, val: _val2 },
                        "circuit.wasm",
                        "circuit_final.zkey"
                      )
                    setSignals(publicSignals)
                    setProof(proof)
                    setResult(null)
                  }
                }}
              >
                Generate Proof
              </Flex>
            </Flex>
            <Box mt={6}>
              <Box as="label">Public Signals</Box>
              <Textarea
                bg="white"
                value={JSON.stringify(signals)}
                fontSize="10px"
                disabled={true}
              />
            </Box>
            <Box mt={4}>
              <Box as="label">Proof</Box>
              <Textarea
                bg="white"
                value={JSON.stringify(proof)}
                fontSize="10px"
                disabled={true}
              />
            </Box>
            <Flex justify="center" mt={4}>
              <Flex
                py={3}
                w="100%"
                bg={proof ? "#5037C6" : "#aaa"}
                justify="center"
                color="white"
                fontSize="16px"
                sx={{
                  borderRadius: "5px",
                  cursor: proof ? "pointer" : "default",
                  ":hover": { opacity: 0.75 },
                }}
                onClick={async () => {
                  if (proof) {
                    const vkey = await fetch("verification_key.json").then(
                      function (res) {
                        return res.json()
                      }
                    )
                    const res = await snarkjs.groth16.verify(
                      vkey,
                      signals,
                      proof
                    )
                    setResult(res)
                  }
                }}
              >
                Verify Proof
              </Flex>
            </Flex>
            <Flex justify="center" mt={6} fontSize="20px">
              <Flex
                fontWeight="bold"
                h="70px"
                bg="white"
                w="100%"
                mb={4}
                justify="center"
                align="center"
                color="#5037C6"
                sx={{ borderRadius: "5px" }}
              >
                {result
                  ? `VALID ( ${signals[0] === "1" ? "exist" : "not exist"} )`
                  : ""}
              </Flex>
            </Flex>
          </Box>
          <Flex justify="center" mt={4} color="#5037C6">
            <Link href="https://github.com/weavedb/zkjson" target="_blank">
              Built by WeaveDB
            </Link>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}
