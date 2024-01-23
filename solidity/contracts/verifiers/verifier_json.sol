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

contract Groth16VerifierJSON {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 20906723375066628996538723964948705883807515490851236717549543933647949219571;
    uint256 constant alphay  = 16603277405602064515576336929405274585704793668006611444340674010517699111175;
    uint256 constant betax1  = 15094144295718056060696456976805274960280819890173699163580614297205641683890;
    uint256 constant betax2  = 2598197794696234583089212408001367512889853689394097760090270035862816362448;
    uint256 constant betay1  = 13019389669452630605176375079598340867413494236340581417103700533129069013294;
    uint256 constant betay2  = 17948608722772603517072567060031950359342932415845723852078363636578090462964;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 10711072566124686834265841982715732378697448459012409505902998706903901541084;
    uint256 constant deltax2 = 15520575756658013837683278837606855996748441404177081834144665047696535354396;
    uint256 constant deltay1 = 21670795361216273264901615496631029269219518939720252741040441908211802206706;
    uint256 constant deltay2 = 18602518854483670884905553918154837342133779460402958263587772213821882545891;

    
    uint256 constant IC0x = 11086791052709537593958527982551466373543557342479473456486918346706557110272;
    uint256 constant IC0y = 20506728735254563637401848289764804706365355653222631223947955738675551382105;
    
    uint256 constant IC1x = 3395672018504856885331557568801382430991065622809977080049087938633695466505;
    uint256 constant IC1y = 16008515660025396265007279223380117478922266924915694760300639683710667540804;
    
    uint256 constant IC2x = 21765086794018723313508040688349754864858333265049520578918793850946099000275;
    uint256 constant IC2y = 697811386339903182398036069234656900767187661360875928460814734795207770242;
    
    uint256 constant IC3x = 19890134840469468860269808836413274874961102551504281644286795822862783578836;
    uint256 constant IC3y = 10501563686653873312925081348712045837799559277882754134863746661191456585317;
    
    uint256 constant IC4x = 3369539760301949842926296294765952701286437018123521538030683232199073077793;
    uint256 constant IC4y = 17029305206701174018920590641604979023986372135961726666915339433517762654894;
    
    uint256 constant IC5x = 16249858468384073197585049724261300836640451596079332252974671216468387477562;
    uint256 constant IC5y = 15430518669979717234332245816406403303816581724709051740811390921375347110404;
    
    uint256 constant IC6x = 15005432332128787752647304265070458721246744260154464921566645180007742802279;
    uint256 constant IC6y = 12228853074973908182958795852882093001137862796451033278357411806506635324421;
    
    uint256 constant IC7x = 8279149102391716348028737479566814742618645832848275208331642895717107868296;
    uint256 constant IC7y = 9028245630419080537816021983399031211599915437683007034212436702559232452386;
    
    uint256 constant IC8x = 9920315178591554201395269399878868095438996004668427910727172420497691574268;
    uint256 constant IC8y = 13977539708344722958417991918934496531835259337681036150638988886470196226252;
    
    uint256 constant IC9x = 64865284880675837338119066159408029670824664912895548295809933993597129855;
    uint256 constant IC9y = 16596614162936398597796948615700133880646516840294055167278997135786201638865;
    
    uint256 constant IC10x = 20041216278333661355857000399562164892538427870735609885548447419114215265900;
    uint256 constant IC10y = 7188425125877597681508434156838946918685965411196380330181753494345911319474;
    
    uint256 constant IC11x = 10344667596317540812042141319424780533548696928275174590606414302423871416439;
    uint256 constant IC11y = 15177912543756596934916481207669485500307163540835148656062032711878901603531;
    
    uint256 constant IC12x = 3003572233500184455318954446784006239696026573012811847295348627074111281539;
    uint256 constant IC12y = 6485361686957307324235352983357156310358934769793375149333110905137006337248;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[12] calldata _pubSignals) public view returns (bool) {
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
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
