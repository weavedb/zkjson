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

contract Groth16Verifier {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 8551455248674230780518198335645580391815322773286870598810054651838967299672;
    uint256 constant alphay  = 1822605387108025140575069082054190850227141558696531247142891893091219886493;
    uint256 constant betax1  = 6151367606487818189201999906120650299611606451623678689177389411304419268223;
    uint256 constant betax2  = 9585957668075684565639768228347335094019763845243950076866922751115551536304;
    uint256 constant betay1  = 2026097150013581222441635945892661894188408324649667941263256601457130520770;
    uint256 constant betay2  = 16354572769783365930749379657708807277561854621377074748225632025050952415294;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 1200040185058215269443162443434356548350981825832528278981010989661324302645;
    uint256 constant deltax2 = 13066650681847087013947036123062526038052845761963245833797091825506694910639;
    uint256 constant deltay1 = 2823798483805397471650305410924071552626100509966036888981251877025300857167;
    uint256 constant deltay2 = 5584542218638348567130376947127323041731502905569386692464746821443492353728;

    
    uint256 constant IC0x = 8816303774696826575386846828852745361050527807778424753747178136510413423923;
    uint256 constant IC0y = 5175511740736840573971231700324867620888076440296121128189918349733146924975;
    
    uint256 constant IC1x = 8155712923896076742879649294513817310589222326025593946921786671067316995490;
    uint256 constant IC1y = 16160264511989803680868591910687404418452897473878605027398093030419806724568;
    
    uint256 constant IC2x = 9520202546015635759444275651364707230826641715904962493457760823064723844982;
    uint256 constant IC2y = 15521233277410296650362517539386663420851692605078237321125008906668557198234;
    
    uint256 constant IC3x = 19451856945338172405308743629705991178374303631618529365444275591180110947898;
    uint256 constant IC3y = 4006742518917338634875194967227594566087038576459698548367260933792038354501;
    
    uint256 constant IC4x = 9173287405658429442628569446687729595285108786268407227940590303343476606220;
    uint256 constant IC4y = 8309826015226300891339555761673556045140425570346405419106443887705570493347;
    
    uint256 constant IC5x = 446930179555510199292295609746298280061285915685359390348005319936624807743;
    uint256 constant IC5y = 3586037500269253265200491220481994640083548020162040703186167330216929852959;
    
    uint256 constant IC6x = 12384226473718571696853688099299643433093472061912726119074343143681079895029;
    uint256 constant IC6y = 6429153362307815317901419673636876643865809677036712292693346164181638812296;
    
    uint256 constant IC7x = 21779698909618770108941681336716496985769247280481758910024184104907822128447;
    uint256 constant IC7y = 2193031033609485479653049789151424481500998590665378930246572987831854263287;
    
    uint256 constant IC8x = 7168099160940343344922870634817025285172765433070838487196037520195262665341;
    uint256 constant IC8y = 18871186039255288642719928609808926694409572820437242620900318253671641498963;
    
    uint256 constant IC9x = 5355487643483258576612743006229389585480062705330349294856444042329349255398;
    uint256 constant IC9y = 18965317230550082858950718721656512028966619259152612097271980798302347126733;
    
    uint256 constant IC10x = 11276695091384751553235492090684194934424484293182497881837802926404575389647;
    uint256 constant IC10y = 18092072028022062316013246020374454453427485492834125276619877425551532690401;
    
    uint256 constant IC11x = 11449844074374441713316950320082623937870669590759409936779790299858587960990;
    uint256 constant IC11y = 13114042561768182858790491693905410008642588278954919367050632306891843518042;
    
 
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
