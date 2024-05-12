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
    uint256 constant alphax  = 15666102625973721621314372231502757622972672186869992706298330320625360022168;
    uint256 constant alphay  = 7860317584437807811785184551736117381909584923230858144057222694769024311858;
    uint256 constant betax1  = 5694626294852239414951192660282103704402907520663058613604080680299155414738;
    uint256 constant betax2  = 5842324628399168549713701697348354919163878880337475549755337604460908215719;
    uint256 constant betay1  = 15299555850342023627325133664905760186157697378199428660903779519265533045460;
    uint256 constant betay2  = 19369932919467500712513911930210382196103616502274926080161996489344136260171;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 4503582552430561212779022449004306860952515258252510730703342683904433748529;
    uint256 constant deltax2 = 18425111920911215222332253146797783332823283746160018203034073853247125442993;
    uint256 constant deltay1 = 4453946082216241594348271243333609134155973515870520791839116124952157106489;
    uint256 constant deltay2 = 6299943403529237547647875143706632408243402531062446767696226637461756039372;

    
    uint256 constant IC0x = 21321207194104473227475304543920529140777253812445062785414102137810628823351;
    uint256 constant IC0y = 17435301628228161373103753422842813332325503638744597201144754851019312998703;
    
    uint256 constant IC1x = 12820400866256307684567623036475747952236795131426943895421353782394091927742;
    uint256 constant IC1y = 60275713036652700837316478219950928712704126788272985582350169411243461644;
    
    uint256 constant IC2x = 857253043166092910744552687303159485904872523742588131455423770248915368285;
    uint256 constant IC2y = 14195849356583660474308242114329315396764028733952643683061195745221866004517;
    
    uint256 constant IC3x = 21758746957477097206930100418195981232696693412252142756415630022251620498988;
    uint256 constant IC3y = 13410227681809155220050013564476536866963972600821261716783794631827707904349;
    
    uint256 constant IC4x = 863580107893288900828264046203999618333374859561603309534755206187548007845;
    uint256 constant IC4y = 17276530052140799694039014154041098203841609580394223470304419489978941020095;
    
    uint256 constant IC5x = 20860866781226655978193967912232894914994034954825205708931667985751271655154;
    uint256 constant IC5y = 12177441101666309938978105246002445372089044967481369877555009124474329640505;
    
    uint256 constant IC6x = 10253410591025171769139608115823458515554722863591962190480237037964222989835;
    uint256 constant IC6y = 2300854166049230775727949815888955384104705675980904483480782073188875432218;
    
    uint256 constant IC7x = 9245031860281158825371686872766118053567656180865626846873554393892189651843;
    uint256 constant IC7y = 18513814971835729370836379685375481264692236826421466003977840558207277913353;
    
    uint256 constant IC8x = 2754620511499804101010165108130638609126165250442796483020701485428889593474;
    uint256 constant IC8y = 21543955085620310283456271839558892054215536683326587016759091514123004776495;
    
    uint256 constant IC9x = 7226523333475405455471783299389388256960485582655675212929034730327278898093;
    uint256 constant IC9y = 5056090250187692130221637329845012688890940869984044755973476873548610820578;
    
    uint256 constant IC10x = 10107033883545633867195921318423461010318227740867478163570877213298959179572;
    uint256 constant IC10y = 503817861296261242201817887974509587032687921855950877235697350857170430743;
    
    uint256 constant IC11x = 21035943047303381225570192698677598249462130417684515089990469613546011008550;
    uint256 constant IC11y = 7261441348374767801093007257999121003733259642366629311136938544979253433119;
    
    uint256 constant IC12x = 20453521999827294992536897361543222148394244433474196230498330885560620003829;
    uint256 constant IC12y = 18476327162478621518583504728598744035870583497372084378654039079117097682;
    
    uint256 constant IC13x = 15724968258919878061585416513119667249637764275276227548708222282031970422796;
    uint256 constant IC13y = 15146709066947881278827713419811426264008528066434458265193671798769307857310;
    
    uint256 constant IC14x = 9097393479338656770619464061691689490135837081335461486896937720741934261539;
    uint256 constant IC14y = 3771549967344233937612853274190217413635208199629257189936808052809357297423;
    
 
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
