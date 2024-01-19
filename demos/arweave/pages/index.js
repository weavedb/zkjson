import Head from "next/head"
import Link from "next/link"
import { Select, Box, Flex, Input, Textarea } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { map, append, concat } from "ramda"
const snarkjs = require("snarkjs")
import { Doc } from "zkjson"
export default function Home() {
  const [signals, setSignals] = useState(null)
  const [proof, setProof] = useState(null)
  const [result, setResult] = useState(null)
  const [type, setType] = useState("number")
  const [json, setJSON] = useState("")
  const [path, setPath] = useState("")
  const [paths, setPaths] = useState([])
  const [num, setNum] = useState("")
  const [bool, setBool] = useState(true)
  const [str, setStr] = useState("")
  const [txid, setTxid] = useState("")
  let valid = false
  try {
    let _j = null
    eval("_j = " + json)
    valid = true
  } catch (e) {}
  let tx_valid = !/^\s*$/.test(txid)
  return (
    <>
      <Head>
        <title>zkJSON Demo - Arweave | Ethereum</title>
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
            <Box ml={4}>Arweave | Ethereum Demo</Box>
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
              You can directly query any Arweave stored JSON from Ethereum smart
              contracts with a zkJSON proof.
            </Box>
            <Box mt={4}>
              <Flex>
                <Box as="label">Arweave Transaction ID</Box> <Box flex={1} />
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
                placeholder="Arweave TxID"
                value={txid}
                onChange={e => setTxid(e.target.value)}
              />
            </Box>
            <Flex justify="center" mt={4}>
              <Flex
                py={3}
                bg={tx_valid ? "#5037C6" : "#aaa"}
                w="100%"
                justify="center"
                color="white"
                fontSize="16px"
                sx={{
                  borderRadius: "5px",
                  cursor: tx_valid ? "pointer" : "default",
                  ":hover": { opacity: 0.75 },
                }}
                onClick={async () => {
                  if (/^\s*$/.test(txid)) {
                    alert("Enter Arweave transaction ID")
                  } else {
                    const getPath = (json, prefix = [], paths = []) => {
                      if (typeof json !== "object") return [prefix.join(".")]

                      for (let k in json) {
                        if (Array.isArray(json[k])) {
                          let i = 0
                          for (let v of json[k]) {
                            const _paths = getPath(
                              v,
                              append(`${k}[$i}]`, prefix)
                            )
                            paths = concat(paths, _paths)
                            i++
                          }
                        } else if (typeof json[k] === "object") {
                          for (let k2 in json[k]) {
                            const _paths = getPath(
                              json[k][k2],
                              append(`${k}.${k2}`, prefix)
                            )
                            paths = concat(paths, _paths)
                          }
                        } else {
                          paths.push(append(k, prefix).join("."))
                        }
                      }
                      return paths
                    }
                    try {
                      const json = await fetch(
                        `https://arweave.net/${txid}`
                      ).then(v => v.json())
                      setJSON(JSON.stringify(json))
                      const paths = getPath(json)
                      setPaths(paths)
                    } catch (e) {
                      alert("JSON fetch failed")
                    }
                  }
                }}
              >
                Get JSON
              </Flex>
            </Flex>
            <Box mt={4}>
              <Flex>
                <Box as="label" color={valid ? "" : "crimson"}>
                  JSON (private, this data won't be revealed){" "}
                  {valid ? "" : "Invalid JSON"}
                </Box>
                <Box flex={1} />
              </Flex>
              <Textarea
                disabled={true}
                bg="white"
                placeholder="{ a : 1 }"
                value={json}
                onChange={e => setJSON(e.target.value)}
              />
            </Box>
            <Box mt={4}>
              <Flex>
                <Box as="label">Path (public)</Box> <Box flex={1} />
              </Flex>
              <Select
                bg="white"
                value={path}
                onChange={e => {
                  const getVal = (j, p) => {
                    return p.length === 0 ? j : getVal(j[p[0]], p.slice(1))
                  }
                  const _json = JSON.parse(json)
                  const paths = e.target.value.split(".")
                  const val = getVal(_json, paths)
                  const type = val === null ? "null" : typeof val
                  setType(type)
                  if (type === "number") {
                    setNum(val)
                  } else if (type === "boolean") {
                    setBool(val)
                  } else if (type === "string") {
                    setStr(val)
                  }
                  setPath(e.target.value)
                }}
              >
                {map(v => <option value={v}>{v}</option>)(paths)}
              </Select>
            </Box>
            <Box mt={4}>
              <Flex>
                <Box flex={1} pr={4}>
                  <Box as="label">Data Type (public)</Box>
                  <Select
                    disabled={true}
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
                      disabled={true}
                      placeholder="1"
                      bg="white"
                      value={str}
                      onChange={e => setStr(e.target.value)}
                    />
                  ) : type === "number" ? (
                    <Input
                      disabled={true}
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
                      disabled={true}
                      placeholder="1"
                      bg="white"
                      value="null"
                      disabled={true}
                    />
                  ) : (
                    <Select
                      disabled={true}
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
                    let _val =
                      type === "number"
                        ? num * 1
                        : type === "string"
                        ? str
                        : type === "boolean"
                        ? bool
                        : null

                    const doc = new Doc({ size: 5, size_json: 256 })
                    const inputs = await doc.getInputs({
                      json: _json,
                      path,
                      val: _val,
                    })
                    const { proof, publicSignals } =
                      await snarkjs.groth16.fullProve(
                        inputs,
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
