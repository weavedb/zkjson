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

pragma solidity ^0.8.14;

contract Groth16VerifierJSON {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 8291347571322986423835508571217211439001052512548940363260041118504005887913;
    uint256 constant alphay  = 13469487457393407382364055320574103701418457348473326541563615563008834145857;
    uint256 constant betax1  = 21383959319414036689691955731768993421144695267634290577251301951623741925941;
    uint256 constant betax2  = 17331937754320941855532380784934009952519936562621365710198756542602661050030;
    uint256 constant betay1  = 6921316453522736571743443831851541053049621703525337874652391039793368870566;
    uint256 constant betay2  = 9719005099338695008133237560226137187112952619970312326660773550033235827712;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 2494255464414794349783339507630791445588396395351829055633447890198613928265;
    uint256 constant deltax2 = 26043893860991659157642336631077203438205892229834051496051473001458710947;
    uint256 constant deltay1 = 9903509911371299000074760518472040351764009893085729984468271207392465673695;
    uint256 constant deltay2 = 13851914541226053919354510019134921716905136324843522146292249444314091742636;

    
    uint256 constant IC0x = 13435682267469115070161559550834652386301376167615535067097048161711090425469;
    uint256 constant IC0y = 9691702796978623047225090316423754866367927431353247572109237048085653248002;
    
    uint256 constant IC1x = 6405191331658281133699877980179955363771132095702233823011954747239645917682;
    uint256 constant IC1y = 14732195596501622644184761282767139140181527270328518592857076773078169807352;
    
    uint256 constant IC2x = 19816724547676255284843795030860568891057807642868952205330519780178764071625;
    uint256 constant IC2y = 19588724680693339502087288626892047352848218951331734501132914283948009408615;
    
    uint256 constant IC3x = 8493370754964556948213065400151947913229978035732646905176969802433492401499;
    uint256 constant IC3y = 4568714971252519932675487103239965688446614111911066018659434260586795441515;
    
    uint256 constant IC4x = 11554428499143410493694086815528992645003532991589836559100405364802883883808;
    uint256 constant IC4y = 20358032293781538470410611278846981173097184414594935751837209665348397353503;
    
    uint256 constant IC5x = 2437030962784470794922478626832448698047096714114130898520950689712392199563;
    uint256 constant IC5y = 20739833518485858419605643452424080712071444216793483903498354184313856680830;
    
    uint256 constant IC6x = 18767795802604734855662586419988439246489464559580713226979390779792076909749;
    uint256 constant IC6y = 7176316032556210478510572093426795784272432916273794126949672295027933618619;
    
    uint256 constant IC7x = 7941224121607596898888586435057418541236043088178559791116491455930943753784;
    uint256 constant IC7y = 17659845041589637152059140439662992431697011217874827822356633401207045071896;
    
    uint256 constant IC8x = 4891216352274953813298704355965890580801695050698326229536509700909113366917;
    uint256 constant IC8y = 4283915462046764696013955866971965551297868223039626550966285892983089696548;
    
    uint256 constant IC9x = 53310609485784033907964191700615616807091917485034613213003462755579003042;
    uint256 constant IC9y = 5829717943736432823737709381623581720232061508078853713941894606713672700173;
    
    uint256 constant IC10x = 2713866407925068482682018081791008709138701942951754177772413867503923353979;
    uint256 constant IC10y = 12631352921870272514312659992904583708423013064727767077745333040820332713966;
    
    uint256 constant IC11x = 617288488047505023352869842246683865550338012923406458651839720628654925255;
    uint256 constant IC11y = 9375095186603699724166112935667590297838682306426796119978357293136348526606;
    
    uint256 constant IC12x = 3117219045051031957691946620329487089935583804558404400052624449000033234761;
    uint256 constant IC12y = 6722385644933790628275331707285311779873734778400894023129548123088338161388;
    
    uint256 constant IC13x = 14885926117502364242483302634136800741377802723299009160619315841116836878091;
    uint256 constant IC13y = 18677014587039694287704694099842998658377406335975796207338334458899464373557;
    
    uint256 constant IC14x = 10123786673051429374015397424479052272578985122645450912063757104013585794125;
    uint256 constant IC14y = 11849745273511203910367941352492202450298366799401122107604135519589900764975;
    
 
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
