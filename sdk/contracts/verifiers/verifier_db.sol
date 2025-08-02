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

contract Groth16VerifierDB {
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
    uint256 constant deltax1 = 566319682436850529692773273170461279524268577891150635825387390239831567882;
    uint256 constant deltax2 = 18860268461005016027048821926573675096822806032916343944940397566918262972873;
    uint256 constant deltay1 = 18469561290186198192930600182225641948070680663786775400869545881576215584097;
    uint256 constant deltay2 = 16843711002267486950099400107694084564320643561117060725912074365097520873528;

    
    uint256 constant IC0x = 15211415922364842912753184178425045511192002084183450091972766587897729031131;
    uint256 constant IC0y = 15971336196196622349517605395705397293225200783943199092270415284510546939053;
    
    uint256 constant IC1x = 3464979308878298246776645144833226341117035087307090727251356729925690049544;
    uint256 constant IC1y = 2701132742000937878189241109199334668029723964378951774716229117963684334785;
    
    uint256 constant IC2x = 17746992021893097019070205838284045039565036550366113750079443947456708932914;
    uint256 constant IC2y = 20205302109688801012538493936661638426411524231619729625407218303411393971055;
    
    uint256 constant IC3x = 12245350253809957962446325719420284548409481797652910572382809447209300296011;
    uint256 constant IC3y = 2181944750218360909814361656088418665618898112511704294612292313825818583174;
    
    uint256 constant IC4x = 14272371780610106622173486440520433262823996106221430333841111091741849894946;
    uint256 constant IC4y = 2651668025058914772481681251893270544825897012494799335931264036971472027402;
    
    uint256 constant IC5x = 15368773499402856795009961960791288514014805980406357981082924459251021982345;
    uint256 constant IC5y = 19702123112400711796073644885827586177870326559870904640843668152019488063904;
    
    uint256 constant IC6x = 10677187776951951873630238944736414260225581042281553648384370976204183115940;
    uint256 constant IC6y = 1992236736977150082653976323411946326010253872212815347510072691523085595255;
    
    uint256 constant IC7x = 21415137280411204335091094503224446366978234376524115265045654108152006539895;
    uint256 constant IC7y = 18542175761555436023959545358821820821282980394602494205800055757297012906764;
    
    uint256 constant IC8x = 6283856560272202991953013809355758204828896535304136319974685636684888856128;
    uint256 constant IC8y = 14499901693513608835779722317486164346309825524575154749627267356894076467615;
    
    uint256 constant IC9x = 19685518566119573827093988474850506880006629001058664371716514877455244663914;
    uint256 constant IC9y = 8481292601887397637049972433197231800580995340144247273832382075808559008848;
    
    uint256 constant IC10x = 223137936376193785345096638287096394886709464533117482694619505935732331537;
    uint256 constant IC10y = 4193175916548019617597370686901033731734454606724750484807673453694700951952;
    
    uint256 constant IC11x = 16453801468826605202509345195157388810770747557053039494013978418267763931861;
    uint256 constant IC11y = 9875951739441984097810674555101191788888352673039488118805457327521421929503;
    
    uint256 constant IC12x = 21492667345885781313718619285662713900245557314551393448696666210356792295028;
    uint256 constant IC12y = 13513771098803659055046650647390462300798249154666189755091027612809331818956;
    
    uint256 constant IC13x = 4220313889112567763732397801925007682896952364521933389131895252279385675080;
    uint256 constant IC13y = 4489372840961844505718038698916106673528658906928588565989450268053621743612;
    
    uint256 constant IC14x = 14271407211698650570939162738932653937074499981772815895780302661786173648938;
    uint256 constant IC14y = 19455923871335066470920134858740491433267919882177953263240475980057134848859;
    
    uint256 constant IC15x = 16133332441580541207424712869162600438872610254859964823012819022285880626496;
    uint256 constant IC15y = 205394163904875832569231417271795177705566674339331369995643748855708511527;
    
    uint256 constant IC16x = 20041249883696113203488105074051660077326597780992987346896682994784878002567;
    uint256 constant IC16y = 17581544103776691653953052153212138864315675260675640899993173889329216891748;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[16] calldata _pubSignals) public view returns (bool) {
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
                
                g1_mulAccC(_pVk, IC13x, IC13y, calldataload(add(pubSignals, 384)))
                
                g1_mulAccC(_pVk, IC14x, IC14y, calldataload(add(pubSignals, 416)))
                
                g1_mulAccC(_pVk, IC15x, IC15y, calldataload(add(pubSignals, 448)))
                
                g1_mulAccC(_pVk, IC16x, IC16y, calldataload(add(pubSignals, 480)))
                

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
            
            checkField(calldataload(add(_pubSignals, 416)))
            
            checkField(calldataload(add(_pubSignals, 448)))
            
            checkField(calldataload(add(_pubSignals, 480)))
            
            checkField(calldataload(add(_pubSignals, 512)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
