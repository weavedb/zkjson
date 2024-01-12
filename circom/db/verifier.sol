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
    uint256 constant deltax1 = 20817122023513722025320552246529802947414745481949707595104839365183619747984;
    uint256 constant deltax2 = 5399027286361488012666462285716080962009506959339205556817033412312360244067;
    uint256 constant deltay1 = 3851473959404960745548473091946637966785375559926922716762054613699005461725;
    uint256 constant deltay2 = 10785543394510109768072115190015935092998141496024010288112608113357355672943;

    
    uint256 constant IC0x = 2643293285539810198330812450508209063559191411853000660000889293790153388622;
    uint256 constant IC0y = 17240850208897923854781589653456185410710584075245129582788832716848761451896;
    
    uint256 constant IC1x = 14183279259776413023128568613200085029587882613107243367432224916373896157803;
    uint256 constant IC1y = 9541156936857381231394910266539717471864613177139034094526789494897529974334;
    
    uint256 constant IC2x = 3499656721546490132629929321213277774592601635630260866783106944572063883662;
    uint256 constant IC2y = 20518021610073097600703036108328158502804563212429036742731592628023563394258;
    
    uint256 constant IC3x = 8660417017660280531921903066232696228912344958924870720569793808119491183394;
    uint256 constant IC3y = 20636463762341379762430306801906041697137718347708672079903432545030291609559;
    
    uint256 constant IC4x = 11265121970648651009249733845610823653790166706670755412121119608223780127681;
    uint256 constant IC4y = 599950475564343654382207277294097571235774197785093039251747225384900837265;
    
    uint256 constant IC5x = 15908748894823493250438682845116884155101623200393453982584006396824584864862;
    uint256 constant IC5y = 9298452984452914369911786708900097862428793910505610467580471216509991230957;
    
    uint256 constant IC6x = 20363096247048994251833924913846092673636881823968790425714263346387569338593;
    uint256 constant IC6y = 21447178210576584972369576360284214927658194666586467931152832092443835757036;
    
    uint256 constant IC7x = 16772991524374889256223389640175328393102155027142157304003957324107984459021;
    uint256 constant IC7y = 1816422425148833342295788744598504504912420982136859437203625607056017824108;
    
    uint256 constant IC8x = 16457079770671884154151474531194154066002111739397898836429487333074816920093;
    uint256 constant IC8y = 21253020145783477123470291465835924600212952204791840215405506522858633634831;
    
    uint256 constant IC9x = 9611148933016621940807508126887340412683476820443658040733000545177437257540;
    uint256 constant IC9y = 5462587049638332642221069888478961945208240226524889222524329844053595510688;
    
    uint256 constant IC10x = 21410860556495231388710007220937700671718366113657977354197965196186913971450;
    uint256 constant IC10y = 2577145672854049795780546216065354349207938630994809331575193901510695428680;
    
    uint256 constant IC11x = 16402471373806958574729741198572750858317090594136136570042236755429318695600;
    uint256 constant IC11y = 13960619657077121019485430373111040516813360399856293929797125160198801721486;
    
    uint256 constant IC12x = 7955152871886388140262536250599785207615342211406607362218918320320516905292;
    uint256 constant IC12y = 8646975021809756345379933542645083667597148870911722245346415592639985746281;
    
    uint256 constant IC13x = 15945293625318183276856250420074360542433345535322132256109589400782358557782;
    uint256 constant IC13y = 9965571553953932588597668798146784466162444891869139134306075621804950185635;
    
    uint256 constant IC14x = 11706046144213643076945267564783813500344966648116753215629662880290656504619;
    uint256 constant IC14y = 13642049248423643190942733714734902070733211196454210369319300273208372729952;
    
 
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
