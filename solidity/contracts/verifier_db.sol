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
    uint256 constant deltax1 = 8659298051940776608744416369338946385824849175889286909320383596506800065301;
    uint256 constant deltax2 = 21565118543577171223023472417074048665765905996953289819154912730431774582158;
    uint256 constant deltay1 = 3372381207963539993961360893526341729158907808437531404974873524099823626995;
    uint256 constant deltay2 = 6377967101970994203748461522366244194813816423396317281063826360738271505661;

    
    uint256 constant IC0x = 12119498404546839077542588487368552904392579103272007423958098004777052860907;
    uint256 constant IC0y = 19994275964420163380667529825737534307462587600159266817923429577706597206506;
    
    uint256 constant IC1x = 10111344067935196691609226582690695790188434926597082445018418368710707443231;
    uint256 constant IC1y = 5092946158824636865598213205548707718599198527498974241930210052485528883844;
    
    uint256 constant IC2x = 18858871214161115831247629897814975022375269626053749108403199342627175063208;
    uint256 constant IC2y = 2409540842507697516393168372807398349283152611451354566266480218040435622987;
    
    uint256 constant IC3x = 236965375505508600754025110680282518977779676309950287607909198882772656749;
    uint256 constant IC3y = 1159131143586810999203813941381728741976474677635897808888326870002860749669;
    
    uint256 constant IC4x = 3413427698877320045145571816206532389536882851922332457528058140798275713215;
    uint256 constant IC4y = 11401020675627602705967759083766003802728419979403706336262390893799754722075;
    
    uint256 constant IC5x = 18508238972666143724586851114935472791821529254734151005105179395908124136379;
    uint256 constant IC5y = 18777948490045564615613034229107007983257270113643318834002462064429820499901;
    
    uint256 constant IC6x = 9308819585639413343809693321361446631096862578746282020879519928544384174401;
    uint256 constant IC6y = 20255183657353364875737926096006610870035733193618728590986585286253258928125;
    
    uint256 constant IC7x = 15764998090071285763960404113695196660306215920700867073618445939042143709540;
    uint256 constant IC7y = 10739538677519892881063291635856882875630351819904411587606541816477786062703;
    
    uint256 constant IC8x = 10094614334815855085089483689317673515641566061215060727931594251475284447128;
    uint256 constant IC8y = 7451012360355671987919715241736714711525822506454664337033831899788537409152;
    
    uint256 constant IC9x = 10154732836271023077981924594010996347772919219184432194077864707097862623485;
    uint256 constant IC9y = 21278816748881983870293658943179116272585297881876526903713621168391648193071;
    
    uint256 constant IC10x = 1623309584468695439554472538162797176932448832719214270447874406219499256367;
    uint256 constant IC10y = 7651565170829124759736628115247046728105685073286865672438513861592761320295;
    
    uint256 constant IC11x = 10106075261150537435963960894639447852635044481363287062680521366251148999145;
    uint256 constant IC11y = 4534389188436639376780324576860028363344227277050518225458637462704292075747;
    
    uint256 constant IC12x = 18123296437571374340270969597551108700347976068878027625358384191202668338837;
    uint256 constant IC12y = 20316552683181143877981579804620066416536025037817229145950596053149733280225;
    
    uint256 constant IC13x = 369994826658027544531617976506020492852053587662532647025779746543905811350;
    uint256 constant IC13y = 21391221966782567738382107799796243961901440305105240824238473725993837523158;
    
    uint256 constant IC14x = 17556909428166656136605557322643206590431934375269296658797633904934632403981;
    uint256 constant IC14y = 554582926920089768954449908182089210466296714317227183925673372432501150417;
    
 
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
