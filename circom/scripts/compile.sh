#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )/../build/circuits/$1"

cd $DIR \
&& circom index.circom --r1cs --wasm --sym --c \
&& cd index_js \
&& node generate_witness.js index.wasm ../input.json witness.wtns \
&& cd .. \
&& snarkjs groth16 setup index.r1cs ../../ptau/$2/pot$2_final.ptau index_0000.zkey \
&& echo $3 | snarkjs zkey contribute index_0000.zkey index_0001.zkey --name="$4" -v \
&& snarkjs zkey export verificationkey index_0001.zkey verification_key.json \
&& snarkjs groth16 prove index_0001.zkey index_js/witness.wtns proof.json public.json \
&& snarkjs groth16 verify verification_key.json public.json proof.json \
&& snarkjs zkey export solidityverifier index_0001.zkey verifier.sol;


