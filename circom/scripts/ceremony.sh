#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )/../build/ptau/$1"

snarkjs powersoftau new bn128 $1 $DIR/pot$1_0000.ptau -v \
&& echo "$3" | snarkjs powersoftau contribute $DIR/pot$1_0000.ptau $DIR/pot$1_0001.ptau --name="$2" -v \
&& snarkjs powersoftau prepare phase2 $DIR/pot$1_0001.ptau $DIR/pot$1_final.ptau -v
