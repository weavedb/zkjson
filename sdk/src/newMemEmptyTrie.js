import SMTMemDb from "./circomlibjs/SMTMemDb.js"
import SMT from "./circomlibjs/SMT.js"
import getHashes from "./circomlibjs/getHashes.js"

export default async function newMemEmptyTrie(kv) {
  const { hash0, hash1, F } = await getHashes()
  const db = new SMTMemDb(F, kv)
  await db.init()
  const rt = await db.getRoot()
  const smt = new SMT(db, rt, hash0, hash1, F)
  return smt
}
