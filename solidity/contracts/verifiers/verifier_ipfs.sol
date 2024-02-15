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

contract Groth16VerifierIPFS {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 15666102625973721621314372231502757622972672186869992706298330320625360022168;
    uint256 constant alphay  = 7860317584437807811785184551736117381909584923230858144057222694769024311858;
    uint256 constant betax1  = 5694626294852239414951192660282103704402907520663058613604080680299155414738;
    uint256 constant betax2  = 5842324628399168549713701697348354919163878880337475549755337604460908215719;
    uint256 constant betay1  = 15299555850342023627325133664905760186157697378199428660903779519265533045460;
    uint256 constant betay2  = 19369932919467500712513911930210382196103616502274926080161996489344136260171;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 8995368816080835835143072781169172556987051854638485583130603535615299464732;
    uint256 constant deltax2 = 12162598894874730633498619802306479291898453288770035605877665211399237315400;
    uint256 constant deltay1 = 7121865255767773456262309515001317256487289793120065449452053001047448676903;
    uint256 constant deltay2 = 19279679121550684016474172857711919712306808051813793684553148699722135419379;

    
    uint256 constant IC0x = 20945183843295312993381510406405873543669675543384079282436972446171646192720;
    uint256 constant IC0y = 17237562686004945119471557466086768664658136328713341131092714841177141297186;
    
    uint256 constant IC1x = 9423505898126706934630437723037477867791881325803426979561185747498248603884;
    uint256 constant IC1y = 19980675547086534485762092967047281071930684412585892533391176822723961061607;
    
    uint256 constant IC2x = 3961649257785166904190571703983544242863367069856754537694032470998824294785;
    uint256 constant IC2y = 5853311129344483701173233268410293570801849258875773235983239471688333169580;
    
    uint256 constant IC3x = 3233462512269185968076989604100678335066400392908725906184172785073954154531;
    uint256 constant IC3y = 18274210053140168886171998394365522823555372719412374320097232641070912316833;
    
    uint256 constant IC4x = 19394233040174444937725358534907990110608457233039221387140653065326537016073;
    uint256 constant IC4y = 1473283723224976577009202680176464915277611663544564844037649071626731064703;
    
    uint256 constant IC5x = 15574938662025589007855619822934518501666611431901573802249765213098911377825;
    uint256 constant IC5y = 827757955383974017316469603076815134305388160740803493270221512995129554043;
    
    uint256 constant IC6x = 3974371314298356883478669654322354475286730445964859003196780796013382715921;
    uint256 constant IC6y = 12620787589482748059469740130305311202319224358206112542639172351834295751265;
    
    uint256 constant IC7x = 5440570961052407415764557326741298774834133328824802691650264754689084722630;
    uint256 constant IC7y = 9851236644950099258163490032679112794901015278692288540404643802852475735737;
    
    uint256 constant IC8x = 3686690383233914932696595126298160975317184130415934240523766563611650199238;
    uint256 constant IC8y = 3838188848371470391929617813354670233200518927628810367004422909753242694678;
    
    uint256 constant IC9x = 10654609284498477843403082545676543765265154279607678480109102881228988939639;
    uint256 constant IC9y = 12848157965321589142881731744340973901150636819656362705030098512612901332082;
    
    uint256 constant IC10x = 9543515896372737289954233733724929591525718583034055988813274540471446124258;
    uint256 constant IC10y = 14627785032322828721599775398516481836091129040829356903027886783587515353163;
    
    uint256 constant IC11x = 1691499420598216729735127787186621314012418624445183869804913820379938026044;
    uint256 constant IC11y = 5904719631621808285227505676837222500196392574281053975820121922137820590872;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[11] calldata _pubSignals) public view returns (bool) {
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
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
