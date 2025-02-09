import Head from "next/head"
import Link from "next/link"
import { Contract, providers } from "ethers"
import { useToast, Select, Box, Flex, Input, Textarea } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { map, append, concat } from "ramda"
const snarkjs = require("snarkjs")
import { Doc } from "zkjson"
const abi = require("../lib/ZKArweave.json").abi
const contractAddr = process.env.NEXT_PUBLIC_CONTRACT_ADDR
import { CopyToClipboard } from "react-copy-to-clipboard"

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
  const [params, setParams] = useState(null)
  const [signature, setSignature] = useState("")
  const [generating, setGenerating] = useState(false)
  const toast = useToast()
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
                <Flex w="100%">
                  <Box as="label" mb={1}>
                    Arweave TxID
                  </Box>
                  <Box flex={1} />
                  <Box
                    mr={2}
                    as="a"
                    href="https://viewblock.io/arweave"
                    target="_blank"
                    sx={{
                      textDecoration: "underline",
                      color: "#5037C6",
                      cursor: "pointer",
                      ":hover": { opacity: 0.75 },
                    }}
                  >
                    Find One on Explorer
                  </Box>
                </Flex>
                <Box flex={1} />
                {json === "" ? null : (
                  <Box
                    w="80px"
                    mx={2}
                    sx={{
                      textDecoration: "underline",
                      color: "#5037C6",
                      cursor: tx_valid ? "pointer" : "default",
                      ":hover": { opacity: 0.75 },
                    }}
                    onClick={() => {
                      setJSON("")
                      setSignature("")
                      setParams(null)
                    }}
                  >
                    Another Tx
                  </Box>
                )}
              </Flex>
              {json === "" ? (
                <Input
                  disabled={json !== ""}
                  bg="white"
                  placeholder="Arweave TxID"
                  value={txid}
                  onChange={e => setTxid(e.target.value)}
                />
              ) : (
                <Box
                  bg="white"
                  fontSize="12px"
                  p={2}
                  sx={{
                    border: "1px solid #5037C6",
                    borderRadius: "3px",
                  }}
                >
                  {txid}
                </Box>
              )}
            </Box>
            {json !== "" ? null : (
              <Flex justify="center" my={4}>
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
                                append(`${k}[${i}]`, prefix)
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
                        setPath(paths[0])
                        const getVal = (j, p) => {
                          return p.length === 0
                            ? j
                            : getVal(j[p[0]], p.slice(1))
                        }
                        const _paths = paths[0].split(".")
                        const val = getVal(json, _paths)
                        const type = val === null ? "null" : typeof val
                        setType(type)
                        if (type === "number") {
                          setNum(val)
                        } else if (type === "boolean") {
                          setBool(val)
                        } else if (type === "string") {
                          setStr(val)
                        }
                        const { hash, signature } = await fetch(
                          "/api/arweave",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ txid }),
                          }
                        ).then(v => v.json())
                        setSignature(signature)
                      } catch (e) {
                        alert("JSON fetch failed")
                        setJSON("")
                      }
                    }
                  }}
                >
                  Get Arweave Tx & JSON
                </Flex>
              </Flex>
            )}
            {!valid ? null : (
              <>
                <Box mt={4}>
                  <Flex>
                    <Box as="label" color={valid ? "" : "crimson"} mb={1}>
                      JSON (private, this data won't be revealed){" "}
                      {valid ? "" : "Invalid JSON"}
                    </Box>
                    <Box flex={1} />
                  </Flex>
                  <Box
                    bg="white"
                    fontSize="12px"
                    p={2}
                    sx={{
                      border: "1px solid #5037C6",
                      borderRadius: "3px",
                    }}
                  >
                    {json}
                  </Box>
                </Box>
                {signature === "" ? (
                  <Box mt={4}>
                    <Flex mt={1} mb={2} justify="center" align="center">
                      <Box
                        as="label"
                        color={signature !== "" ? "" : "#5037C6"}
                        textAlign="center"
                      >
                        <Box
                          as="i"
                          className="fas fa-spin fa-circle-notch"
                          mr={2}
                        />
                        Validating Arweave Tx...
                      </Box>
                    </Flex>
                  </Box>
                ) : (
                  <>
                    <Box mt={4}>
                      <Flex mt={1} mb={1}>
                        <Box
                          as="label"
                          color={signature !== "" ? "" : "crimson"}
                        >
                          Validator Signature (veridating the existence of the
                          Arweave Tx)
                        </Box>
                        <Box flex={1} />
                      </Flex>
                      <Box
                        bg="white"
                        fontSize="12px"
                        p={2}
                        sx={{
                          border: "1px solid #5037C6",
                          borderRadius: "3px",
                        }}
                      >
                        {signature}
                      </Box>
                    </Box>
                    <Box p={4} bg="white" my={4} sx={{ borderRadius: "3px" }}>
                      <Box mx={2}>
                        <Flex mb={1}>
                          <Box as="label">Path (public)</Box> <Box flex={1} />
                        </Flex>
                        <Select
                          bg="white"
                          value={path}
                          onChange={e => {
                            const getVal = (j, p) => {
                              if (p.length === 0) {
                                return j
                              } else {
                                const sp = p[0].split("[")
                                for (let v of sp) {
                                  if (/]$/.test(v)) {
                                    j = j[v.replace(/]$/, "") * 1]
                                  } else {
                                    j = j[v]
                                  }
                                }
                                return getVal(j, p.slice(1))
                              }
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
                          <Box width="150px" pr={2}>
                            <Box mx={2} as="label">
                              Data Type (public)
                            </Box>
                            <Box
                              mt={1}
                              fontSize="12px"
                              mx={2}
                              p={2}
                              sx={{
                                border: "1px solid #5037C6",
                                borderRadius: "3px",
                              }}
                            >
                              {type}
                            </Box>
                          </Box>
                          <Box flex={1} pl={2}>
                            <Box mx={2} as="label">
                              Value (public)
                            </Box>
                            <Box
                              mt={1}
                              fontSize="12px"
                              mx={2}
                              p={2}
                              sx={{
                                border: "1px solid #5037C6",
                                borderRadius: "3px",
                                wordBreak: "break-all",
                              }}
                            >
                              {type === "string"
                                ? str
                                : type === "number"
                                ? num
                                : type === "null"
                                ? "null"
                                : bool}
                            </Box>
                          </Box>
                        </Flex>
                      </Box>
                      <Flex justify="center" mt={4}>
                        <Flex
                          mx={2}
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
                            if (generating === false) {
                              setGenerating(true)
                              setParams(null)
                              try {
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

                                  const doc = new Doc({
                                    size: 5,
                                    size_json: 256,
                                  })
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

                                  const vkey = await fetch(
                                    "verification_key.json"
                                  ).then(function (res) {
                                    return res.json()
                                  })
                                  const res = await snarkjs.groth16.verify(
                                    vkey,
                                    publicSignals,
                                    proof
                                  )
                                  setResult(res)
                                  const inputs2 = [
                                    ...proof.pi_a.slice(0, 2),
                                    ...proof.pi_b[0].slice(0, 2).reverse(),
                                    ...proof.pi_b[1].slice(0, 2).reverse(),
                                    ...proof.pi_c.slice(0, 2),
                                    ...publicSignals,
                                  ]
                                  const sigs = inputs2.slice(8)
                                  const params = [
                                    txid,
                                    sigs.slice(2, 7),
                                    inputs2,
                                    signature,
                                  ]
                                  const getVal = (j, p) => {
                                    if (p.length === 0) {
                                      return j
                                    } else {
                                      const sp = p[0].split("[")
                                      for (let v of sp) {
                                        if (/]$/.test(v)) {
                                          console.log(v.replace(/]$/, "") * 1)
                                          j = j[v.replace(/]$/, "") * 1]
                                        } else {
                                          j = j[v]
                                        }
                                      }
                                      return getVal(j, p.slice(1))
                                    }
                                  }
                                  const paths = path.split(".")
                                  const val = getVal(_json, paths)
                                  let type2 =
                                    val === null
                                      ? 0
                                      : typeof val === "string"
                                      ? 3
                                      : typeof val === "boolean"
                                      ? 1
                                      : typeof val === "number"
                                      ? Number.isInteger(val)
                                        ? 2
                                        : 2.5
                                      : 4

                                  let op = null
                                  switch (type2) {
                                    case 0:
                                      op = "qNull"
                                      break
                                    case 1:
                                      op = "qBool"
                                      break
                                    case 2:
                                      op = "qInt"
                                      break
                                    case 2.5:
                                      op = "qFloat"
                                      break
                                    case 3:
                                      op = "qString"
                                      break
                                    case 4:
                                      op = "qRaw"
                                      break
                                  }
                                  setParams({ op, params })
                                  /*
                                  const provider = new providers.Web3Provider(
                                    window.ethereum,
                                    "any"
                                  )
                                  const zkar = await new Contract(
                                    contractAddr,
                                    abi,
                                    provider
                                  )
                                  switch (type2) {
                                    case 0:
                                      console.log(await zkar.qNull(...params))
                                      break
                                    case 1:
                                      console.log(await zkar.qBool(...params))
                                      op = "qBool"
                                      break
                                    case 2:
                                      console.log(await zkar.qInt(...params))
                                      op = "qInt"
                                      break
                                    case 2.5:
                                      console.log(await zkar.qFloat(...params))
                                      op = "qFloat"
                                      break
                                    case 3:
                                      console.log(await zkar.qString(...params))
                                      op = "qString"
                                      break
                                    case 4:
                                      console.log(await zkar.qRaw(...params))
                                      op = "qRaw"
                                      break
                                      }
                                      */
                                }
                              } catch (e) {
                                console.log(e)
                                alert("something went wrong, please try again.")
                              }
                              setGenerating(false)
                            }
                          }}
                        >
                          {generating ? (
                            <Box
                              as="i"
                              className="fas fa-spin fa-circle-notch"
                            />
                          ) : (
                            "Generate Proof"
                          )}
                        </Flex>
                      </Flex>
                    </Box>
                  </>
                )}
              </>
            )}
            {!params ? null : (
              <Box mt={6}>
                <Box
                  bg="white"
                  w="100%"
                  fontSize="14px"
                  mb={4}
                  color="#5037C6"
                  p={4}
                  sx={{ borderRadius: "5px" }}
                >
                  <Box>
                    <Box align="center">
                      Copy & Paste the input values to
                      <Box as="b" mx={1}>
                        {params.op}
                      </Box>
                      function on PolygonScan
                    </Box>
                    <Box mt={2}>
                      <Flex>
                        <Box mx={2} mb={1}>
                          txid (string) - Arweave TxId
                        </Box>
                        <Box flex={1} />
                        <CopyToClipboard
                          text={params.params[0]}
                          onCopy={() => {
                            toast({
                              duration: 1000,
                              position: "top-right",
                              render: () => (
                                <Flex
                                  justify="center"
                                  bg="#5037C6"
                                  color="white"
                                  p={2}
                                  m={1}
                                  sx={{ borderRadius: "3px" }}
                                >
                                  txid copied!
                                </Flex>
                              ),
                            })
                          }}
                        >
                          <Box
                            mr={4}
                            sx={{
                              textDecoration: "underline",
                              cursor: "pointer",
                              ":hover": { opacity: 0.75 },
                            }}
                          >
                            Copy
                          </Box>
                        </CopyToClipboard>
                      </Flex>
                      <Box
                        mx={2}
                        p={2}
                        sx={{
                          border: "1px solid #5037C6",
                          borderRadius: "3px",
                        }}
                      >
                        {params.params[0]}
                      </Box>
                    </Box>
                    <Box mt={2}>
                      <Flex>
                        <Box mx={2} mb={1}>
                          path (uint256[5]) - encoded path to value
                        </Box>
                        <Box flex={1} />
                        <CopyToClipboard
                          text={`[${params.params[1].join(",")}]`}
                          onCopy={() => {
                            toast({
                              duration: 1000,
                              position: "top-right",
                              render: () => (
                                <Flex
                                  justify="center"
                                  bg="#5037C6"
                                  color="white"
                                  p={2}
                                  m={1}
                                  sx={{ borderRadius: "3px" }}
                                >
                                  path copied!
                                </Flex>
                              ),
                            })
                          }}
                        >
                          <Box
                            mr={4}
                            sx={{
                              textDecoration: "underline",
                              cursor: "pointer",
                              ":hover": { opacity: 0.75 },
                            }}
                          >
                            Copy
                          </Box>
                        </CopyToClipboard>
                      </Flex>
                      <Box
                        mx={2}
                        p={2}
                        sx={{
                          border: "1px solid #5037C6",
                          borderRadius: "3px",
                        }}
                      >
                        [{params.params[1].join(",")}]
                      </Box>
                    </Box>
                    <Box mt={2}>
                      <Flex>
                        <Box mx={2} mb={1}>
                          zkp (uint256[20]) - zk proof and public signals
                        </Box>
                        <Box flex={1} />
                        <CopyToClipboard
                          text={`[${params.params[2]
                            .map(v => `${v}`)
                            .join(",")}]`}
                          onCopy={() => {
                            toast({
                              duration: 1000,
                              position: "top-right",
                              render: () => (
                                <Flex
                                  justify="center"
                                  bg="#5037C6"
                                  color="white"
                                  p={2}
                                  m={1}
                                  sx={{ borderRadius: "3px" }}
                                >
                                  zkp copied!
                                </Flex>
                              ),
                            })
                          }}
                        >
                          <Box
                            mr={4}
                            sx={{
                              textDecoration: "underline",
                              cursor: "pointer",
                              ":hover": { opacity: 0.75 },
                            }}
                          >
                            Copy
                          </Box>
                        </CopyToClipboard>
                      </Flex>
                      <Box
                        mx={2}
                        p={2}
                        sx={{
                          border: "1px solid #5037C6",
                          borderRadius: "3px",
                        }}
                      >
                        [{params.params[2].map(v => `${v}`).join(",")}]
                      </Box>
                    </Box>
                    <Box mt={2}>
                      <Flex>
                        <Box mx={2} mb={1}>
                          sig (bytes) - validator signature
                        </Box>
                        <Box flex={1} />
                        <CopyToClipboard
                          text={params.params[3]}
                          onCopy={() => {
                            toast({
                              duration: 1000,
                              position: "top-right",
                              render: () => (
                                <Flex
                                  justify="center"
                                  bg="#5037C6"
                                  color="white"
                                  p={2}
                                  m={1}
                                  sx={{ borderRadius: "3px" }}
                                >
                                  sig copied!
                                </Flex>
                              ),
                            })
                          }}
                        >
                          <Box
                            mr={4}
                            sx={{
                              textDecoration: "underline",
                              cursor: "pointer",
                              ":hover": { opacity: 0.75 },
                            }}
                          >
                            Copy
                          </Box>
                        </CopyToClipboard>
                      </Flex>
                      <Box
                        mx={2}
                        p={2}
                        sx={{
                          border: "1px solid #5037C6",
                          borderRadius: "3px",
                        }}
                      >
                        {params.params[3]}
                      </Box>
                    </Box>
                    <Flex justify="center" mt={4} mx={1}>
                      <Flex
                        fontSize="16px"
                        justify="center"
                        mx={1}
                        color="white"
                        py={3}
                        w="100%"
                        bg="#5037C6"
                        sx={{
                          borderRadius: "5px",
                          cursor: proof ? "pointer" : "default",
                          ":hover": { opacity: 0.75 },
                        }}
                        as="a"
                        target="_blank"
                        href={`https://mumbai.polygonscan.com/address/${contractAddr}#readContract`}
                      >
                        Go To PolygonScan
                      </Flex>
                    </Flex>
                  </Box>
                </Box>
              </Box>
            )}
            <Box mt={6}>
              <Box
                bg="white"
                w="100%"
                mb={4}
                color="#5037C6"
                p={4}
                sx={{ borderRadius: "5px" }}
                fontSize="12px"
              >
                <Box mb={2} fontWeight="bold" fontSize="14px">
                  How it works?
                </Box>
                <Box>
                  We could simply prove an arbitrary JSON with zkJSON on
                  Ethereum, but there needs to be logic to validate existence of
                  Arweave transactions. For this demo, we use a simple
                  centralized validator to check an Arweave gateway and sign the
                  poseidon hash of the encoded JSON. Once you have the
                  signature, you can query any data field in that JSON with the
                  Ethereum smart contract. The ethereum contract (Polygon
                  Mumbai) checks the zkJSON proof and the validator's signature.
                </Box>
                <Box mt={2}>
                  However, for real use cases, we can use a decentralized
                  validator such as Lit protocol's PKP and Lit Action to do the
                  same. WeaveDB also has a zkDB and zkRollup mechanisms to build
                  hyper-scalable decentralized databases.
                </Box>
                <Box mt={2}>
                  We could also remove the validator signature check from the
                  smart contract and zk-proof the signature with another
                  circuit. This will make the onchain computation lighter and
                  simpler, but the offchain circuit computation heaviour and
                  more complex.
                </Box>
                <Box mt={2}>
                  These optimizations are out of scope for this simple demo.
                </Box>
                <Flex mt={2} justify="center">
                  <Box
                    as="a"
                    sx={{ textDecoration: "underline" }}
                    target="_blank"
                    href="https://github.com/weavedb/zkjson"
                  >
                    Go Check the Litepaper
                  </Box>
                </Flex>
              </Box>
            </Box>
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
