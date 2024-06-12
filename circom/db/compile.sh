circom index.circom --r1cs --wasm --sym
snarkjs r1cs export json index.r1cs index.r1cs.json
cd index_js
node generate_witness.js index.wasm ../input.json ../witness.wtns
cd ../
snarkjs groth16 setup index.r1cs pot12_final.ptau index_final.zkey
snarkjs zkey export verificationkey index_final.zkey verification_key.json
snarkjs groth16 prove index_final.zkey witness.wtns proof.json public.json
snarkjs groth16 verify verification_key.json public.json proof.json
snarkjs zkey export solidityverifier index_final.zkey verifier.sol
snarkjs zkey export soliditycalldata public.json proof.json