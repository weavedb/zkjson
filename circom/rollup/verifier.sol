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
    uint256 constant deltax1 = 5895899630303038042745141244905423159164640693343224870514245862251917951889;
    uint256 constant deltax2 = 11866372291159404880006594102796807190296139073025173119565268361633847470430;
    uint256 constant deltay1 = 19247541773758250635129700622634381552825273715430931423991129973790971984603;
    uint256 constant deltay2 = 737585320484051552960928890868671216247732839475835544357930080405597548544;

    
    uint256 constant IC0x = 15435311668523784987779957046007865490886896839716115606455252698803096808580;
    uint256 constant IC0y = 1434435212120708893632059187978901566399423488398255345896166000132571131957;
    
    uint256 constant IC1x = 12926935022278005983335498491572510160638161998263153433118949247112471762160;
    uint256 constant IC1y = 9862026850333766686077568075499384423011353802460529604489616715417436812013;
    
    uint256 constant IC2x = 2658044916919022821040359536963302442388981201604431245950012578241623331432;
    uint256 constant IC2y = 5636959178276234388602881611054403505927215814045533181215803591897963985437;
    
    uint256 constant IC3x = 20180039629682398037381244790392362537555169462427324994851966189979577849150;
    uint256 constant IC3y = 18599079169299283074346772658858203055628905504940217075547941668187189594684;
    
    uint256 constant IC4x = 1703531665993711699980620696932998813942172450082738033719515512997681506161;
    uint256 constant IC4y = 2719477103284345472999720753377551264809279476762775038289279907423386741914;
    
    uint256 constant IC5x = 10279982356884414449280931926925018736686725546751051131306662128959739715312;
    uint256 constant IC5y = 14013073943560094961241038166480799751028900007992422001570468058036516903887;
    
    uint256 constant IC6x = 17071655090154524917833599023915933821190238341011205984542735247931032378666;
    uint256 constant IC6y = 3791705822180240490954376359976702673814941952549578223480256851861762156078;
    
    uint256 constant IC7x = 2315921086887242101665531265002576982724169477212838650073772374040560388103;
    uint256 constant IC7y = 13140819534749550630043039721559104309919870650154421085788540269301456609786;
    
    uint256 constant IC8x = 2244300842324855734546442296910185563714616311795273894955320068298533628824;
    uint256 constant IC8y = 15254085831666643884786857840306957028730453106988522425334088006195012670576;
    
    uint256 constant IC9x = 18992096129322349257465984971051853278821816047094294951904597961754331965976;
    uint256 constant IC9y = 13078314756980054008253022101812244439427644590228735710462030731829424238840;
    
    uint256 constant IC10x = 19339531911454532682259393521685026937321574824389837107381350848769023520264;
    uint256 constant IC10y = 8484855873906904252095722396584851415931868105967524670877274816750942429938;
    
    uint256 constant IC11x = 238100358880738644785685026482213689709371589935724324234197103696342868840;
    uint256 constant IC11y = 21101676406493046470275770039851861346527469851897300785198843388606485404062;
    
 
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
