#!/bin/bash
circom index.circom --r1cs --wasm --sym --c \
&& cd index_js \
&& node generate_witness.js index.wasm ../input.json witness.wtns \
&& cd .. \
&& snarkjs groth16 setup index.r1cs ../pot12_final.ptau index_0000.zkey \
&& snarkjs zkey contribute index_0000.zkey index_0001.zkey --name="zkJSON" -v \
&& snarkjs zkey export verificationkey index_0001.zkey verification_key.json \
&& snarkjs groth16 prove index_0001.zkey index_js/witness.wtns proof.json public.json \
&& snarkjs groth16 verify verification_key.json public.json proof.json;
