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
    uint256 constant deltax1 = 20503591479484091524389745903571071797103515451455738548515763475839920684921;
    uint256 constant deltax2 = 5617943403828393228867947181181000280381763965560908736009901041763172427158;
    uint256 constant deltay1 = 19083313989582849416852727426203922087129577621288485271208858162180563989517;
    uint256 constant deltay2 = 6862756714407978275897080062526754044127957156216819881004695153747745594448;

    
    uint256 constant IC0x = 8117166905692109919104291343856029475477412767491303376211389191152967038468;
    uint256 constant IC0y = 9786515749803639719852807382408592347129424775311166090035686108630492765324;
    
    uint256 constant IC1x = 8372619712685736857836778212277410061184000966061820660353663736436010324900;
    uint256 constant IC1y = 7067497483771029122224543049910217766313555809959258482125432607420578209549;
    
    uint256 constant IC2x = 8664544978528071254218294973797032588678014503773496766308416357733046318778;
    uint256 constant IC2y = 1718370739886043626655047048989167081845643514431816517183086335106787323814;
    
    uint256 constant IC3x = 17751478333748864683647456466294726036073972233143791990284780060329145813120;
    uint256 constant IC3y = 5332438974111244723611637766367681701415489964863909660487320379077476391752;
    
    uint256 constant IC4x = 20742828080385750796683930560189396553036781354782278562302384256732853843949;
    uint256 constant IC4y = 1351673933396889997409523595926983213620423546050525776383348532660582633773;
    
    uint256 constant IC5x = 20503268205499473416904271262498573431374552398139117269682363052068963140978;
    uint256 constant IC5y = 3732804412299701993142127591762498360367649767364421523113109866299226710165;
    
    uint256 constant IC6x = 14257995503266038917376264725392135727319727614567664291464265707947560137941;
    uint256 constant IC6y = 341674734661014039525000101720981104421961371042562178520683297866596707154;
    
    uint256 constant IC7x = 8193832556543527639708689676411352413933876589415237015016698770441031255042;
    uint256 constant IC7y = 6594427869611603078697503063082014095062802376771554910392397589449346189644;
    
    uint256 constant IC8x = 13583345943944676979948187443700187050998549308300528606491967244177176520006;
    uint256 constant IC8y = 4938411793249197289917720689106756285526796809363092891408044710943884674802;
    
    uint256 constant IC9x = 11332284497411134754454830299053795514601435700763578724160974435166700044531;
    uint256 constant IC9y = 13019000604073974366403109311897527900603263821666939992822627393063021671404;
    
    uint256 constant IC10x = 14399226292391120536283418546213611923264868223599916657548457588778188745914;
    uint256 constant IC10y = 15721807309515116598525148493431362514780681023570830598111469229105621080436;
    
    uint256 constant IC11x = 9762413796519510440691741324561546062505760014187240868624893625208356342750;
    uint256 constant IC11y = 16246137136591544636923946475468706707718504791810616178029498386514365251482;
    
 
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
