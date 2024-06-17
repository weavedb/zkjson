const { toSignal, pad, encode } = require("zkjson")
const { newMemEmptyTrie, buildPoseidon } = require("zkjson/circomlibjs")
const { splitEvery } = require("ramda")
const { Contract, Wallet, providers, utils } = require("ethers")
const abi = require("../../lib/ZKArweave.json").abi
const contractAddr = process.env.NEXT_PUBLIC_CONTRACT_ADDR

export default async function handler(req, res) {
  const provider = new providers.JsonRpcProvider(process.env.EVM_RPC)
  const zkar = await new Contract(contractAddr, abi, provider)
  const txid = req.body.txid
  const _json = await fetch(`https://arweave.net/${txid}`).then(v => v.json())
  const _value = pad(toSignal(encode(_json)), 256)
  const tree = await newMemEmptyTrie()
  const poseidon = await buildPoseidon()
  let _hash_value = _value
  if (_value.length === 256) {
    _hash_value = []
    for (let v of splitEvery(16, _value)) {
      const poseidon = await buildPoseidon()
      const value = poseidon(v)
      _hash_value.push(value)
    }
  }
  const value = poseidon(_hash_value)
  const _hash = tree.F.toObject(value).toString()
  const hash = await zkar.getMessageHash(txid, _hash)
  const pkp = Wallet.createRandom()
  const signature = await pkp.signMessage(utils.arrayify(hash))
  res.json({ hash: _hash, signature })
}
