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

contract Groth16VerifierRU {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 8154397773694967106321908543225581308345926075547707849461770589063806208933;
    uint256 constant alphay  = 5677108055266898448889486339855982693826760854574703967712162419621387623014;
    uint256 constant betax1  = 4355293952982460708458173032048895255835173115891032808050720056003898803424;
    uint256 constant betax2  = 3059800330157143526908077176335177789758447764497844662322128804304930412762;
    uint256 constant betay1  = 12948155637479005941322226125984465377528965309571693953410360452319923301251;
    uint256 constant betay2  = 7332222563511878888805485279601765944630172818413249156252409812683246711891;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 12826039923985305509172445548825630308307897385636638314103089050117034765807;
    uint256 constant deltax2 = 5777316040111550683119122338100696671533578054713112313962719197468777904391;
    uint256 constant deltay1 = 13100118653411399080908320939554734522926116642572965561618759712020115377487;
    uint256 constant deltay2 = 4863992084126820334137644474127866316351574790993028000936897867731380377202;

    
    uint256 constant IC0x = 6270950016247133466336754274326443126017687703801742756948638236534086892047;
    uint256 constant IC0y = 20310453393525738917452540227487036745129047678621136376195858836563533911527;
    
    uint256 constant IC1x = 1141343197515056438569346347535803858564689453833647046018791462772549149227;
    uint256 constant IC1y = 16491780663163267442130703331018113562992698794258578658230547724337214632511;
    
    uint256 constant IC2x = 5569694830107596991306292701850289725347601942273592203980263593485643232633;
    uint256 constant IC2y = 5496875873369182800954050214612959091907601104963709673444966250025502326758;
    
    uint256 constant IC3x = 856226396972901355666350894014284120170327945287396680478814592107007149805;
    uint256 constant IC3y = 4080222902213037494283476857599202091267684100021446005131603140238216815391;
    
    uint256 constant IC4x = 10764306455319897189590233363611208010675243280639689255137625645138943859385;
    uint256 constant IC4y = 19346540917500920047750697423047140511552971607568238316315807020898102730868;
    
    uint256 constant IC5x = 16857068565745876906748660361991141069946983257614833579471638734061485457112;
    uint256 constant IC5y = 14632180805427053926564788976583761986580123762441719835724709161702471836981;
    
    uint256 constant IC6x = 12315747360356477219902572740218642460149278211574165192334271766621665438376;
    uint256 constant IC6y = 1313234108449442273460693358644853644145068014633280121061495643296281134420;
    
    uint256 constant IC7x = 15252212582859770288887248094717972825568314500168925087757606041256952964029;
    uint256 constant IC7y = 19751607759272618647644406330677066920139018206963959740625861713276025168423;
    
    uint256 constant IC8x = 8432690145128824085267914412714661508760195558814883868966832777728733350601;
    uint256 constant IC8y = 20683188851611894785172396447809130386092126094512442322570355864144302756164;
    
    uint256 constant IC9x = 19369987132771616043793275659835942692385855791064890369063891639761686156657;
    uint256 constant IC9y = 8426683055759400985089789088504223062497842350159798813155638560974712761643;
    
    uint256 constant IC10x = 20860096825664394339889589645802586392309097833727587594050802394079690409091;
    uint256 constant IC10y = 17908147166318266417496260692526339764629505794576827802816790292654348457101;
    
    uint256 constant IC11x = 7111525545052173450141644018481693095722931164254044734852844952175519360375;
    uint256 constant IC11y = 14968059451881120855243147686628983750275388350316603656458857787322628363714;
    
 
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
