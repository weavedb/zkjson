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
    uint256 constant deltax1 = 7076566306066614148689726508504687217483932843352618134353947483309282585796;
    uint256 constant deltax2 = 18409657799058785089416838268873800534707044012485777609887333479214238777736;
    uint256 constant deltay1 = 7677219017699187399492986772160987282969574759581344651612840630526212339013;
    uint256 constant deltay2 = 3303370933816790204507213466731669226327106929928012958700507934630860878563;

    
    uint256 constant IC0x = 5236360242072007410985874593661146605329437842811662703192965413479009529336;
    uint256 constant IC0y = 10357248943596834026038019543534432605729515949394555949892557583787580011561;
    
    uint256 constant IC1x = 19607495364275814222926087505389548802415523169632437144726167052029442967048;
    uint256 constant IC1y = 6088754021874830712497210613489797835727546299431159574585863144944466538313;
    
    uint256 constant IC2x = 6913799601542081507749503611420785731620763637452269397885325552544219377508;
    uint256 constant IC2y = 20157940875310794582819478079502960228709611163866749792075742463783317695887;
    
    uint256 constant IC3x = 1945339883727583520210419349789733274398023124099374413517186223542939552498;
    uint256 constant IC3y = 2331581932473161009751118050380318473963347597380435310014163731643152388233;
    
    uint256 constant IC4x = 9345713161786156416059138118092107611837547458095865995535729090044144740943;
    uint256 constant IC4y = 9106294679124608897095183442810613797255899305831744813677200535259538361693;
    
    uint256 constant IC5x = 12634932825077563736461146400688756644871785718542537160891788136918927970678;
    uint256 constant IC5y = 8909903190670972834637783143320178857373031658249198756905737127080216371504;
    
    uint256 constant IC6x = 19390830753239473204356043445312696382617832908619901816900713619194464005971;
    uint256 constant IC6y = 9982157256722753777218919036201901525474409206699486604096724765494137698415;
    
    uint256 constant IC7x = 16664640971289070218479774816244154390889364125991398303827922480795174328103;
    uint256 constant IC7y = 11827767802993660154977138386223031054681447099808080246598843682983065998989;
    
    uint256 constant IC8x = 16427285243842948064423447708360544684297647672697048690451837063807379726397;
    uint256 constant IC8y = 7168659446832591718032717761916798798214868546725888290433714588186948330914;
    
    uint256 constant IC9x = 21303211841253272498286672265432738612876523940879083417174651586278797223761;
    uint256 constant IC9y = 18651141932304057289460927047168966432240179754082381249742383751599523515170;
    
    uint256 constant IC10x = 10497614675942417777067579369586833063058750507931160239346755841544014803023;
    uint256 constant IC10y = 18112483744505687824388383679574283122146635695853681324337003003404065609235;
    
    uint256 constant IC11x = 7717404642018367491260899941018036350714611312371426497231582819449320339879;
    uint256 constant IC11y = 6441342611494131973034154295270931826104944864049998427145257605834655518566;
    
    uint256 constant IC12x = 13038526650253558416672947405901074536815747477686408243063721942861268693296;
    uint256 constant IC12y = 2510221902407021309696978780901867078148553797930230942148343029395466314055;
    
    uint256 constant IC13x = 6454492874293243894321644544739367168905056499659308585646674136470293112015;
    uint256 constant IC13y = 7053143649443735572828824107480552985107161403142788572772554961023969340419;
    
    uint256 constant IC14x = 10957100575194614094966066035846437014017335461942860317575893519990581643664;
    uint256 constant IC14y = 13821911929451831107071853600051697877644062103544802131086910446466363785752;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[14] calldata _pubSignals) public view returns (bool) {
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
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
