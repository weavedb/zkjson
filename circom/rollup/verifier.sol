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
    uint256 constant deltax1 = 4983130122239138026367451564853843954805122285557779970677269942860946290054;
    uint256 constant deltax2 = 17180728779754911682106127283274747153777622703773473758586949994316815687928;
    uint256 constant deltay1 = 16184697165546179629089435371047264258805220936943096440754371489742210247877;
    uint256 constant deltay2 = 7633411305867717374824224350647942976693701182262238790181965292989417752883;

    
    uint256 constant IC0x = 2922257911826095613701792880195885491756584933286130428202149445656124351619;
    uint256 constant IC0y = 4049104874028565870795428898057254117564486005022479493340255893345594012024;
    
    uint256 constant IC1x = 19613477229731134545153538026191874063664511880546218721556424123937928384100;
    uint256 constant IC1y = 20199581742197179421373706897543308943289546981676803965486608072909436069662;
    
    uint256 constant IC2x = 14411270952138928520486346947649594233540066964009553040905256454288687450597;
    uint256 constant IC2y = 11480071198118191364364368382038114332096713004007621247097736041360677195792;
    
    uint256 constant IC3x = 9685976774938044548540199038105196219511622401186249136031684515237732052481;
    uint256 constant IC3y = 5282660023535936816085533097526277663906983895015325327111027707546696760597;
    
    uint256 constant IC4x = 3661623808818705884032463794426906185567660056669082804119475624807717866348;
    uint256 constant IC4y = 9371073811557031012679967726841290494319495162232656804447676261234698628154;
    
    uint256 constant IC5x = 10997552999952433242143118043499239039632695790034310464101742236116595738721;
    uint256 constant IC5y = 18364012517250691941346915410303378242071817027190928095844496582721205968542;
    
    uint256 constant IC6x = 16730923325200390046170457152584421178995659977936187725781839864434569278919;
    uint256 constant IC6y = 11636073395770059229686029609322788230524983951268568184544181256584553494665;
    
    uint256 constant IC7x = 1795608145156447173765023235297521757661033859749774629094280747479935970234;
    uint256 constant IC7y = 8213623585713413765203098054612991175683658889009931098576523156740556328197;
    
    uint256 constant IC8x = 5593190235321539035298644880161446833557577872499915216915001438680137385266;
    uint256 constant IC8y = 7850875337519856601954981887097893890271186314353758150213492551268293663519;
    
    uint256 constant IC9x = 1277010901162962656423551454103361108613996308193991897617449362421913949120;
    uint256 constant IC9y = 4803055085407191503155117815363038943234445965266838220943424021669336114694;
    
    uint256 constant IC10x = 14405795706694860225480768528348392922681378001038265463816261019182340228870;
    uint256 constant IC10y = 14786185391119144812362974607454981426743987513853656088482904573675434454062;
    
    uint256 constant IC11x = 606826578806742594069471767020879694277107461175735567260956092439396559363;
    uint256 constant IC11y = 18307929908981229366617533311716157498718048806115466068490463644100230224878;
    
 
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
