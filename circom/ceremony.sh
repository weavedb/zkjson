#!/bin/bash
snarkjs powersoftau new bn128 $1 pot$1_0000.ptau -v
snarkjs powersoftau contribute pot$1_0000.ptau pot$1_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 pot$1_0001.ptau pot$1_final.ptau -v
