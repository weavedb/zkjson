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
    uint256 constant deltax1 = 16108517980506854297849182541741553709725147068726502437460795221662934054392;
    uint256 constant deltax2 = 11108122055952200981463380103442015838004112520282166325679324656261172289310;
    uint256 constant deltay1 = 15540443534206155738973728487806979316634787078945919829097599147377062022852;
    uint256 constant deltay2 = 21379352474752452421616166568647842540503269819420348102486102247380909072561;

    
    uint256 constant IC0x = 21491549690759898325084849607299564336640876765821749498156862035601257576731;
    uint256 constant IC0y = 7673274862583779134920456438013707521756656044641568042313054191508669514090;
    
    uint256 constant IC1x = 7384807594330870281878199565618965338344331100873316262082027153266713199801;
    uint256 constant IC1y = 14876621143313435278104193218580147792502814126320367012799180884583971278043;
    
    uint256 constant IC2x = 14168855774320618160297871496225220542802525303313492506646049444075434034461;
    uint256 constant IC2y = 2468759921621309671933672856806282408346496190229767650695758108046431009056;
    
    uint256 constant IC3x = 20882499572322978549523449110104123650836957036545445021640442961988931511616;
    uint256 constant IC3y = 10781231220582947841663615195913878935048287628839154817279937306701845963832;
    
    uint256 constant IC4x = 3551014538515980043254241443826671153636028870428071676154749646867482617102;
    uint256 constant IC4y = 17513115597425155133040003702455782665905020659681301812064653011904364586605;
    
    uint256 constant IC5x = 105515585129844888605937953967649955568230431552746130229062574355263145521;
    uint256 constant IC5y = 20200666388807201898426694143171918805989526661219556885905461961107161411873;
    
    uint256 constant IC6x = 19504246290594149902008126941831109015032250944240332802409169333280249886793;
    uint256 constant IC6y = 17699531383222577195964406519381055857401242060823677129203944848736284577334;
    
    uint256 constant IC7x = 15254965952105123078324026560946378979667618649209045648866104810507209861613;
    uint256 constant IC7y = 3641619426903900212193517444566552500256221100745411003347851827295876272315;
    
    uint256 constant IC8x = 4499605970446611025648671992837865142426045383246510513270735661446224104646;
    uint256 constant IC8y = 15341853963424215265359126787955887881741741004410294373221073774379489499288;
    
    uint256 constant IC9x = 4636178543162541151831226653997316232974453000168920950316536975489566766643;
    uint256 constant IC9y = 2799228255066264685511548900627321262829537276926174168686910780679641714598;
    
    uint256 constant IC10x = 6388673479423994256307474279305289225670011140384557756459873981364992797681;
    uint256 constant IC10y = 15445971588389648358240399113305305960608235393782465515171348639813010141589;
    
    uint256 constant IC11x = 16999109717455015622767449319493463705406770611876428205363721384440112529191;
    uint256 constant IC11y = 8675643256310098492425698438900503035238176419524618195032951410590093388339;
    
    uint256 constant IC12x = 16871502461507515213546155066931373929841527789003952441940247163262482018578;
    uint256 constant IC12y = 4970662515578058992947951260883675496659331271578004380224271812057151496904;
    
    uint256 constant IC13x = 13968526389162956068739649724104930691708514396451450078611693259360926530004;
    uint256 constant IC13y = 8822824035572686629738946181419338699884848605068510614565951757702861630826;
    
    uint256 constant IC14x = 13433257895962314784382997146377098286327147717667015994113571363174981683976;
    uint256 constant IC14y = 16316358056856673776145141235445376046620537375366520262647177307024013423430;
    
 
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
