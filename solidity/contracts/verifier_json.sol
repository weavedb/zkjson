// SPDX-License-Identifier: GPL-3.0
/*
    Copyright 2021 0KIMS association.

    This file is generated with [snarkJS](https://github.com/iden3/snarkjs).

    snarkJS is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    snarkJS is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with snarkJS. If not, see <https://www.gnu.org/licenses/>.
*/

pragma solidity >=0.7.0 <0.9.0;

contract Groth16VerifierJSON {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 7332885377758315278340183047560982420908393795468599595091895974752420296340;
    uint256 constant alphay  = 332255058049377868589021735422241784808251989994698755461004804814851540428;
    uint256 constant betax1  = 14918511796604743115529252945397806548811923425844505517068409231790256866971;
    uint256 constant betax2  = 211413574403138532859071680094500506786935898681671422463746292741380691281;
    uint256 constant betay1  = 19126853899579995366417647673795374157635727056721981778430611935842415927913;
    uint256 constant betay2  = 19131403844100444556608656382423150552404085133882015610549223179149801306375;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 8778953153895167140801159972138887693000611366500157505127608636174382054606;
    uint256 constant deltax2 = 7156402624745626817088873620667212892373193048534817918048444344582127808199;
    uint256 constant deltay1 = 15409977163028627745606562064378045641943443717311465348895192400331775112959;
    uint256 constant deltay2 = 6127749910612865802775348493533411564760857202041068074885879457830771131731;

    
    uint256 constant IC0x = 14149961698706401474756013637219762589886084844706330955521170102253661785782;
    uint256 constant IC0y = 12234408390949945565728151697713577721072768882766707772269268661650572015929;
    
    uint256 constant IC1x = 15287398227625205558818431588910290770512662117774041546723640633129931357061;
    uint256 constant IC1y = 16012938837910940678360804184951691699846514147461899602384360632673883428896;
    
    uint256 constant IC2x = 9418709953143181098924564786961115384655969340686778743507647523173886049039;
    uint256 constant IC2y = 11367527508005828024999408976465266676043307816796847517725311003575198690479;
    
    uint256 constant IC3x = 6030863567192013675941022755318414592630768333244345100569879259036699787359;
    uint256 constant IC3y = 14659074011411032793161383706226526849424995839698828898401936143049675949239;
    
    uint256 constant IC4x = 19963179709991794771873805927403251489690353439768757800630946653626635161707;
    uint256 constant IC4y = 1470766587651703535085614791279830514388462305603574340659937640856761424395;
    
    uint256 constant IC5x = 14659390081523554628219805325675728281784994838522534096490755865319885123083;
    uint256 constant IC5y = 11287441218915253838012709899838816796039024083285099779106808382644409454441;
    
    uint256 constant IC6x = 16250390867585764345415023080703876700586439759793624872982224204111668882485;
    uint256 constant IC6y = 8035681254387642287763926439378674113266797781140623660108466958190513530084;
    
    uint256 constant IC7x = 16179522891432586899572983586580199373249206719523536115810454935385979852482;
    uint256 constant IC7y = 21493117163996505943733751819663993908203969619214657020729691663220708780018;
    
    uint256 constant IC8x = 10514168627673971656312201849246481479452043276699188440350351264194471133025;
    uint256 constant IC8y = 20133917426168149360907990301877459703907720340598371306707853823386928860250;
    
    uint256 constant IC9x = 6266965211637046181111806809564867246649620928402563041803484933568280189957;
    uint256 constant IC9y = 7946958101666049254953231611540370717046038943359039062825104454493066303159;
    
    uint256 constant IC10x = 19760592053490991883913906245948207730828356105180720589710426327543408434351;
    uint256 constant IC10y = 2794087805839231510776045227837416461273508102639790771777910214138852571223;
    
    uint256 constant IC11x = 18199503593569846044109884213575086619142399095780120064324920465410206678544;
    uint256 constant IC11y = 19237589446350435847357191463973661320008591906666182081064297336131201934242;
    
    uint256 constant IC12x = 19573137937282925164552262830726242817408707332199773844604230285268555301250;
    uint256 constant IC12y = 2662418044136441320926682626787705028452732305078998815313537787219417917203;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[12] calldata _pubSignals) public view returns (bool) {
        assembly {
            function checkField(v) {
                if iszero(lt(v, q)) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }
            
            // G1 function to multiply a G1 value(x,y) to value in an address
            function g1_mulAccC(pR, x, y, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, x)
                mstore(add(mIn, 32), y)
                mstore(add(mIn, 64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, mIn, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }

                mstore(add(mIn, 64), mload(pR))
                mstore(add(mIn, 96), mload(add(pR, 32)))

                success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }

            function checkPairing(pA, pB, pC, pubSignals, pMem) -> isOk {
                let _pPairing := add(pMem, pPairing)
                let _pVk := add(pMem, pVk)

                mstore(_pVk, IC0x)
                mstore(add(_pVk, 32), IC0y)

                // Compute the linear combination vk_x
                
                g1_mulAccC(_pVk, IC1x, IC1y, calldataload(add(pubSignals, 0)))
                
                g1_mulAccC(_pVk, IC2x, IC2y, calldataload(add(pubSignals, 32)))
                
                g1_mulAccC(_pVk, IC3x, IC3y, calldataload(add(pubSignals, 64)))
                
                g1_mulAccC(_pVk, IC4x, IC4y, calldataload(add(pubSignals, 96)))
                
                g1_mulAccC(_pVk, IC5x, IC5y, calldataload(add(pubSignals, 128)))
                
                g1_mulAccC(_pVk, IC6x, IC6y, calldataload(add(pubSignals, 160)))
                
                g1_mulAccC(_pVk, IC7x, IC7y, calldataload(add(pubSignals, 192)))
                
                g1_mulAccC(_pVk, IC8x, IC8y, calldataload(add(pubSignals, 224)))
                
                g1_mulAccC(_pVk, IC9x, IC9y, calldataload(add(pubSignals, 256)))
                
                g1_mulAccC(_pVk, IC10x, IC10y, calldataload(add(pubSignals, 288)))
                
                g1_mulAccC(_pVk, IC11x, IC11y, calldataload(add(pubSignals, 320)))
                
                g1_mulAccC(_pVk, IC12x, IC12y, calldataload(add(pubSignals, 352)))
                

                // -A
                mstore(_pPairing, calldataload(pA))
                mstore(add(_pPairing, 32), mod(sub(q, calldataload(add(pA, 32))), q))

                // B
                mstore(add(_pPairing, 64), calldataload(pB))
                mstore(add(_pPairing, 96), calldataload(add(pB, 32)))
                mstore(add(_pPairing, 128), calldataload(add(pB, 64)))
                mstore(add(_pPairing, 160), calldataload(add(pB, 96)))

                // alpha1
                mstore(add(_pPairing, 192), alphax)
                mstore(add(_pPairing, 224), alphay)

                // beta2
                mstore(add(_pPairing, 256), betax1)
                mstore(add(_pPairing, 288), betax2)
                mstore(add(_pPairing, 320), betay1)
                mstore(add(_pPairing, 352), betay2)

                // vk_x
                mstore(add(_pPairing, 384), mload(add(pMem, pVk)))
                mstore(add(_pPairing, 416), mload(add(pMem, add(pVk, 32))))


                // gamma2
                mstore(add(_pPairing, 448), gammax1)
                mstore(add(_pPairing, 480), gammax2)
                mstore(add(_pPairing, 512), gammay1)
                mstore(add(_pPairing, 544), gammay2)

                // C
                mstore(add(_pPairing, 576), calldataload(pC))
                mstore(add(_pPairing, 608), calldataload(add(pC, 32)))

                // delta2
                mstore(add(_pPairing, 640), deltax1)
                mstore(add(_pPairing, 672), deltax2)
                mstore(add(_pPairing, 704), deltay1)
                mstore(add(_pPairing, 736), deltay2)


                let success := staticcall(sub(gas(), 2000), 8, _pPairing, 768, _pPairing, 0x20)

                isOk := and(success, mload(_pPairing))
            }

            let pMem := mload(0x40)
            mstore(0x40, add(pMem, pLastMem))

            // Validate that all evaluations ∈ F
            
            checkField(calldataload(add(_pubSignals, 0)))
            
            checkField(calldataload(add(_pubSignals, 32)))
            
            checkField(calldataload(add(_pubSignals, 64)))
            
            checkField(calldataload(add(_pubSignals, 96)))
            
            checkField(calldataload(add(_pubSignals, 128)))
            
            checkField(calldataload(add(_pubSignals, 160)))
            
            checkField(calldataload(add(_pubSignals, 192)))
            
            checkField(calldataload(add(_pubSignals, 224)))
            
            checkField(calldataload(add(_pubSignals, 256)))
            
            checkField(calldataload(add(_pubSignals, 288)))
            
            checkField(calldataload(add(_pubSignals, 320)))
            
            checkField(calldataload(add(_pubSignals, 352)))
            
            checkField(calldataload(add(_pubSignals, 384)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
