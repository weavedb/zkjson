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
    uint256 constant alphax  = 18805280085444200649868907725685521505422461686923974455471731840676962672644;
    uint256 constant alphay  = 17881691987300688338149108367340188677969779819822908384096705615713076037807;
    uint256 constant betax1  = 18032662747063350693345110850083835617215844064721101490750999620243368061173;
    uint256 constant betax2  = 3929970971158005630402350260010719210493571648873121642997246681476867101731;
    uint256 constant betay1  = 10774402202375816536941008447368740299377204665634972081519510584624375651374;
    uint256 constant betay2  = 11048991759910656196930238109735388222637364021290896470109330331534851428937;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 12120150799143036757959044302700374932546726961047960139956131366281985418991;
    uint256 constant deltax2 = 17087754471830988672145955614566587524002188096419729381517066996799282550507;
    uint256 constant deltay1 = 8941667684761212794608034066204346765788384302493197123011035095949352855469;
    uint256 constant deltay2 = 8463836615255546576031024195344086720123605854140524563584512693372899952852;

    
    uint256 constant IC0x = 15901297474233432092350181251623707733169165476957984463529510044387531369793;
    uint256 constant IC0y = 578342454570239899242093962913971983715194996335148815995933127286360255419;
    
    uint256 constant IC1x = 18788494135551052617245473041900260591509948607623269495193758565033056752386;
    uint256 constant IC1y = 3069833126415887855294404643848974724553885764946843629743806360916262750536;
    
    uint256 constant IC2x = 19200133746720642551097863929813711036495555405093212516825169177835121313406;
    uint256 constant IC2y = 1408132532216220726127836167740876074948093643523300929468971090631036428641;
    
    uint256 constant IC3x = 11552594968969254734981376875520707066961754483790578510029400985848706988788;
    uint256 constant IC3y = 8626211496624637085181481118479446660743741549440219392651017203671268230287;
    
    uint256 constant IC4x = 4467751603977977036947748923489092996860822724085479341682157130889179273432;
    uint256 constant IC4y = 6915379555158953332373716438808766112055086188377148552428951719717493129141;
    
    uint256 constant IC5x = 2206324442951099709647838250134342791305640402779820494306546479452996738220;
    uint256 constant IC5y = 12732075611133666285622197004155961393659204854003797697827860124689655433836;
    
    uint256 constant IC6x = 5932068228307029871222053272975546846495676139381986429143695287573733202426;
    uint256 constant IC6y = 17942785934020400409109697830531996217711430704325728097560508904249675939717;
    
    uint256 constant IC7x = 13345901665584783503934460881836573740899349287105529782351487148886195624367;
    uint256 constant IC7y = 19025706431611204563960821878412965759181914730053161603252270487093061836631;
    
    uint256 constant IC8x = 14110233150786340030995164961320241034492614202081109980935507453329120177459;
    uint256 constant IC8y = 3833407131288785360160394402530990906185308432202201903438846474091299039912;
    
    uint256 constant IC9x = 3227816139388909511665252035515565062660637708666031240391262108187396259396;
    uint256 constant IC9y = 509932199843785797900889572948252477522806525068952875608615341624918510394;
    
    uint256 constant IC10x = 4694268620715163136871077582329700610984271168620337854978732918890943170133;
    uint256 constant IC10y = 8100921910208001770679554398376483979559123390680629771962285588933872610470;
    
    uint256 constant IC11x = 265520240804859411966226054667486228392586972650876503899686626488174311975;
    uint256 constant IC11y = 9516320326057813387168204687842191999867217639605347497786628346075760409957;
    
    uint256 constant IC12x = 2195747189686309848665596542075707033681693766747286562802707673591696016093;
    uint256 constant IC12y = 14098757225053273699616806075838193424283698706090876938415739831703819603119;
    
    uint256 constant IC13x = 16813020209951780680508659573135005581829222627969079842163135808412237887672;
    uint256 constant IC13y = 9024398663226783682413575076298477590145828872599600620513481631947731348746;
    
    uint256 constant IC14x = 14361054450513545372109793963701342647016018570145782779858777731469611118455;
    uint256 constant IC14y = 10430597269523870875242003485949227139047401813940812040929665355082941293113;
    
 
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
