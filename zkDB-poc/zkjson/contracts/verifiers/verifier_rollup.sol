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
    uint256 constant alphax  = 314951146376926193077608957584755852115054366015181103018654962472098258441;
    uint256 constant alphay  = 7485156304149179116943351497686188852758708733356558248218396114572256338555;
    uint256 constant betax1  = 5697051387048108819278074185243805971652217294032376354398284271556645311545;
    uint256 constant betax2  = 3913888702925200111660308334359820288370729484061238958305401635253787780008;
    uint256 constant betay1  = 3903182708334379286099117830599610228306092094358923134522257079351887869528;
    uint256 constant betay2  = 7931150950728133002531269297890385973060960093166571482703690073365199741015;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 12181079203424781490172060421083220775056427090320222325062554796210664678526;
    uint256 constant deltax2 = 21027364464887384615364792593622479502712587631598170981453591251042943752350;
    uint256 constant deltay1 = 13134021118452285085534739544012772882431501303967346349038015094998140244566;
    uint256 constant deltay2 = 12711363110921338357754556491765369587562335963038235253003292539701083028946;

    
    uint256 constant IC0x = 5464531640846843911427736831284755000104222878360515457030417089331169823690;
    uint256 constant IC0y = 21398193737832758191870382509654867864326313124582455844715326995687924597984;
    
    uint256 constant IC1x = 3214766593789442465924177569121062430690821295084523944813448620284297845680;
    uint256 constant IC1y = 5394312010931952645407348637639733185435184113353606912476837857897216406034;
    
    uint256 constant IC2x = 12775851370248682311165201594582054163048648158726682959570288873064416476365;
    uint256 constant IC2y = 239605161043043691408552056584302620894616451760620299756715831446695112596;
    
    uint256 constant IC3x = 13291764855328883947592665991617093151018370433338591082464709910086259741946;
    uint256 constant IC3y = 18828569445235349991921331090428501707212070991896470321525828438002869768068;
    
    uint256 constant IC4x = 12790781845202834418961458534251454461889903985858159997262657558303206376342;
    uint256 constant IC4y = 6592031770905050173378664034440040307934260555737498311648144129664514325991;
    
    uint256 constant IC5x = 19082773356475268040017550195786714840006840179221732579522064955658105470413;
    uint256 constant IC5y = 157227195496244366638950131712089470486924720010967495478438262273731968533;
    
    uint256 constant IC6x = 15253868249746680503621844831822950811609794245196362584506724486383538699066;
    uint256 constant IC6y = 14101363738781754371163987511552004251094838372633246446619463735548874531312;
    
    uint256 constant IC7x = 9149624518837834560203632386955085035212684301301266735249686016238729314944;
    uint256 constant IC7y = 11570757349201445951650233518143374792699164622346254597943791997356181223438;
    
    uint256 constant IC8x = 10270383450888105469583555982222534766006079641005298500101973689063994617176;
    uint256 constant IC8y = 17218292823200831523054843693395401837901575223023346441982839737391504225230;
    
    uint256 constant IC9x = 12191526906874172208546297836421626605955487941597100993312965292772306317280;
    uint256 constant IC9y = 13462470317572893676617495824989985096681504850225141358422885245561988683858;
    
    uint256 constant IC10x = 4471550163693080955170007356431627764769808862680535439105592404464398792825;
    uint256 constant IC10y = 4006043483723711856529001441943300267038997298879603629490155550462880916303;
    
    uint256 constant IC11x = 20135685149038332478183795533788424465254337159027126132670686740116660377190;
    uint256 constant IC11y = 20383012657714025691642611258138994751609695749734695000568811072427633432693;
    
 
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
