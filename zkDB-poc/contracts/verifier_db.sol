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
    uint256 constant alphax  = 2040791876386878368850292585044634565971386206690111663929912555684190517041;
    uint256 constant alphay  = 20087643634024479942842636548305702900845693328801319739966990676867474860399;
    uint256 constant betax1  = 553511120135908745266863209902903100987001107783743867321998161825001435812;
    uint256 constant betax2  = 209521776244322954094669263237702754014190844019888441066202155215722473265;
    uint256 constant betay1  = 21134426795075408827217838753354234794981586445416050988588373042458672588616;
    uint256 constant betay2  = 4991688087298571829925273112986951562721161706795269038619408665168530614787;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 19500257922158622568413334137494170705274292504322099184392919006495070877609;
    uint256 constant deltax2 = 6245330801736754783965843517972565654240004034078573779314976213040775331063;
    uint256 constant deltay1 = 16579445156381237770465594375130834207491365700955722094452651255346774626518;
    uint256 constant deltay2 = 13908124096947746708355040937338080832213681787690581778360069464775641811689;

    
    uint256 constant IC0x = 19854912845694970192837708405367055916093155096333042655068364267681660567282;
    uint256 constant IC0y = 2847285464050390514212361481490144395333981414301232650128395641276250915648;
    
    uint256 constant IC1x = 9257613275975361224687847565943168746137718679210927920006196641597325866971;
    uint256 constant IC1y = 10025031731315646430841498054781102920199878505264503683462209133378860968572;
    
    uint256 constant IC2x = 20433953569758360549996708041871323533392977102083221807847600669400972822784;
    uint256 constant IC2y = 8077288970332106933456064265655368344732831078411555439372399448130906814011;
    
    uint256 constant IC3x = 6360838453640904418808244950946530594044930846217085033803231270747333807310;
    uint256 constant IC3y = 4618120656196299449847872012860561526094252239856665870874691909500162437664;
    
    uint256 constant IC4x = 10094129563904132630528242188103431917969567920923166869952013024961759719465;
    uint256 constant IC4y = 7051331665134977340549668347754616969554567204202115010755303578634716181388;
    
    uint256 constant IC5x = 20444470503817496420104988607783851699351439255269994624281562992593290112055;
    uint256 constant IC5y = 19353448959821783289523074055938354689927599821541228278943219437019267427484;
    
    uint256 constant IC6x = 17110400880303770303449617402786279869423086290710660522510708776164217270641;
    uint256 constant IC6y = 17223382922824867223312845451526577724866117153329852235338906572627724874160;
    
    uint256 constant IC7x = 13707265985076017941259625647343146645424661352062463093751721359701951255088;
    uint256 constant IC7y = 13416757696930620685071921872992744655593600911844790267597428959611922070154;
    
    uint256 constant IC8x = 16070456129822271484245248985164962495292828246281465561225979084568283882469;
    uint256 constant IC8y = 16186089007337269562121964832889233100575223517464254660811127428854198071460;
    
    uint256 constant IC9x = 8737121673933304312599442504070817761457016253935522330943460874155872757598;
    uint256 constant IC9y = 20620403111607970392326800427847266393914112398425682564697731099889771080230;
    
    uint256 constant IC10x = 6226616007169267131926537250732261552376031270373903910781287600487552674449;
    uint256 constant IC10y = 14739935656430928303038150492693400281657654307571570758889743602102825204115;
    
    uint256 constant IC11x = 15196734039599739428662391018775168890066319350316976653788803288283409298356;
    uint256 constant IC11y = 11033142209002437377887351922003404147865443993365944790660543074603722661429;
    
    uint256 constant IC12x = 12564783621581234813324157631833814389632570730957137245266078340300555657322;
    uint256 constant IC12y = 4800647243995844568877240037896924791475043398419350183937987638803077504502;
    
    uint256 constant IC13x = 12974564850504707307581939718950858755063499860400050863007521714280928848018;
    uint256 constant IC13y = 19843526740776003854728461915536274717216095706398618546681951119511956800850;
    
    uint256 constant IC14x = 18461589279195174662878359265071231817822670803052552203187853767566781712230;
    uint256 constant IC14y = 11710691893732652946527147782045244029558794516859804297147016798495562820147;
    
    uint256 constant IC15x = 7599344435910257506461773182665772722857484575523094090288026703871407308813;
    uint256 constant IC15y = 10775506224468576249425086035255031227027703674013298173608360409418302396496;
    
    uint256 constant IC16x = 3110007543686330929201198945741569130953570368463005724099632514291375781156;
    uint256 constant IC16y = 6934306627693433919852304670137076147350305732194169406992316134628664188402;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[16] calldata _pubSignals) public view returns (bool) {
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
                
                g1_mulAccC(_pVk, IC15x, IC15y, calldataload(add(pubSignals, 448)))
                
                g1_mulAccC(_pVk, IC16x, IC16y, calldataload(add(pubSignals, 480)))
                

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
            
            checkField(calldataload(add(_pubSignals, 480)))
            
            checkField(calldataload(add(_pubSignals, 512)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
