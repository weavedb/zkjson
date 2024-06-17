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

contract Groth16VerifierIPFS {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 8551455248674230780518198335645580391815322773286870598810054651838967299672;
    uint256 constant alphay  = 1822605387108025140575069082054190850227141558696531247142891893091219886493;
    uint256 constant betax1  = 6151367606487818189201999906120650299611606451623678689177389411304419268223;
    uint256 constant betax2  = 9585957668075684565639768228347335094019763845243950076866922751115551536304;
    uint256 constant betay1  = 2026097150013581222441635945892661894188408324649667941263256601457130520770;
    uint256 constant betay2  = 16354572769783365930749379657708807277561854621377074748225632025050952415294;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 146777209207054605867012766179094502537968350551215607925008955076263549067;
    uint256 constant deltax2 = 2633871596100807401284925083226459189796882085586154321492118367916651237117;
    uint256 constant deltay1 = 21012385740760062171685374025920180961146768579042536716146176459660919755825;
    uint256 constant deltay2 = 609193939489547291159258179603724194177454651776958423928855714448170018063;

    
    uint256 constant IC0x = 14336108542425917447460243179215548887531443288921789758034763267112594821597;
    uint256 constant IC0y = 3063213467055302869374991715296034939540087046417250761544285949694763841224;
    
    uint256 constant IC1x = 4649077026587766761105661538801822811988500686660034528257902152995286226420;
    uint256 constant IC1y = 12476233742593937621066536626700126467027086901944282038169835118443143832808;
    
    uint256 constant IC2x = 8360661053332583973195437525518843345679737721254788511839602890275293657231;
    uint256 constant IC2y = 17787996208475963315027667576666223922798463669064180714282632392130781352372;
    
    uint256 constant IC3x = 9785946569079751391790764046446286786358664716750710071871199052326292539659;
    uint256 constant IC3y = 882817021266081946311354002521419385351487574180348607719516996266190947737;
    
    uint256 constant IC4x = 12640809291531477845870075407023311270862795189161180453532797575567652906794;
    uint256 constant IC4y = 19250290048961761008598356232356849064316055284499983192468783482080590733004;
    
    uint256 constant IC5x = 3198295856781295857057806156834726458390487561260194669912832637191868555057;
    uint256 constant IC5y = 8868721020835362932335076322428234697810491236107884777501043742060235784522;
    
    uint256 constant IC6x = 2390514925938908056105222000048474798061414661077134335973534900416551578765;
    uint256 constant IC6y = 18883933119651599452018586778571926484219893156571441861996812826417265802414;
    
    uint256 constant IC7x = 15567735182868663313348652396736838594417606007485390406094199614279723158262;
    uint256 constant IC7y = 19899783647699456279776467890503763801710062356400886856148489342470135803967;
    
    uint256 constant IC8x = 2922198146313718955094653112638333704853847719783139987672963810850958623221;
    uint256 constant IC8y = 3211087459991011312413694578006874376946148198550163814081916529506248827593;
    
    uint256 constant IC9x = 9280481517335805553019773877827568388027208648564094894076810187486828340182;
    uint256 constant IC9y = 2731446469023583556556729659060863588647053155331668021298670538047182930916;
    
    uint256 constant IC10x = 7035120402594659715437206973891969111861616263537882691220816912555808912102;
    uint256 constant IC10y = 8370859161564184043870414118742730294716324516315488627679669627182324762731;
    
    uint256 constant IC11x = 18252892156409549471503582711942818186827898810269534550816546500103237657138;
    uint256 constant IC11y = 6950088786053252068858608708134843976953853650037336267170927255140899434651;
    
    uint256 constant IC12x = 1755334072548569264255483825752328756660188502261310823252508026502612340595;
    uint256 constant IC12y = 12909479005409400076810176928877098887011256368485947999972819085993034755040;
    
    uint256 constant IC13x = 16552097706159454847442530278886453064027141214501763360789580344863692453677;
    uint256 constant IC13y = 5953929881514293853952996241019965086771550587823788071996449823934001732390;
    
    uint256 constant IC14x = 3619185968560138174014630305975632830516758120217041036852576895912618097991;
    uint256 constant IC14y = 9281821052864420364933957831589472205720239940338123268483559666384084907310;
    
    uint256 constant IC15x = 8254503030347082641414552423570190634778931316381219189926097849958527585897;
    uint256 constant IC15y = 364992073027338908344465820235200531762259034144802123806746602200531788638;
    
    uint256 constant IC16x = 5526967546231986666584937042885735121525132484493928084139764638439494777879;
    uint256 constant IC16y = 5238298736071644765241632504874656258530712298519490697816165224135772674015;
    
    uint256 constant IC17x = 11928052158849068333141322537401085721326834497814420594439681913154248710859;
    uint256 constant IC17y = 6819923895885234828441212107217745771874421854826251598301558050245481472152;
    
    uint256 constant IC18x = 13945286268685774585609284245816122274534387542425213152741186224804686735403;
    uint256 constant IC18y = 20023689850736852834109177652413698312032305876184320679250698041789812935094;
    
    uint256 constant IC19x = 7345507858994618648486291116179494001930311013835063487161165329704325424673;
    uint256 constant IC19y = 13928084575810620402150382964740122579679242576231832883484884405840679683901;
    
    uint256 constant IC20x = 1542441211724186377808041204123941120846139064048464703338728903271040045155;
    uint256 constant IC20y = 3137377505747175717463089909181680260568123949190130340237345349107426734620;
    
    uint256 constant IC21x = 18089876871595627141331157080961334994521269475674526479685363215994451907921;
    uint256 constant IC21y = 9556757584162576607270540349818518035313172920973593402949336403762080493424;
    
    uint256 constant IC22x = 2126963146484286503213121003041916545819167147574473267028159001088956325722;
    uint256 constant IC22y = 4923799230582507077776334588235423484373707349019813468005175190929445597332;
    
    uint256 constant IC23x = 1630008211499579806083756573010653820366097456772208529610704186894072654114;
    uint256 constant IC23y = 21437256692871950627902345579957133056203192045088530552506588351495386493166;
    
    uint256 constant IC24x = 6235978833784508527303135386340770208795082800621337764375680315249012051641;
    uint256 constant IC24y = 12520301994905913552569827428623824498834825369768182952275266194107133887225;
    
    uint256 constant IC25x = 9557042378880522891280724245561857565447408880647499944291316491268970962716;
    uint256 constant IC25y = 4173053254415271189443551378493704301370073903364032874912232886621214855107;
    
    uint256 constant IC26x = 5558907137697988062356440590341908538012066339933041966524965383919631140772;
    uint256 constant IC26y = 1265354759221499511400922895984559714213033403777454282193151605098116101224;
    
    uint256 constant IC27x = 9751551689854585596056969317163661915316163388666152587113212932637176997224;
    uint256 constant IC27y = 686959062408464500590766187395139140177788305086921348267296100926858548877;
    
    uint256 constant IC28x = 15204338996215015644140305596940498013424414654865369050416831529709084870388;
    uint256 constant IC28y = 17585032747777531711309342640732261489304745528556013313094390294891315463238;
    
    uint256 constant IC29x = 8528266626121058510818266872617216484482519464579558987555612207506785300417;
    uint256 constant IC29y = 12342223818139102981014759549174695502236137848012989763919197196673493022149;
    
    uint256 constant IC30x = 17119266520828561648406080997934525667613304604584000471035966025020243600422;
    uint256 constant IC30y = 18421665471214296462582991761975569758896336070160927846098291580332941148620;
    
    uint256 constant IC31x = 4742762351654917727826973627189432694622053729108562318066638202153782440166;
    uint256 constant IC31y = 296418244077098783759573476971605864587653722780349167140381095009970460627;
    
    uint256 constant IC32x = 6373420478804238387526525255482563203767655965084763378892963777920233699752;
    uint256 constant IC32y = 5240958927388120686836069809918888077195822596812702309572478339377048402239;
    
    uint256 constant IC33x = 13182478548935811389881548821935789228860539963311772803469562081018115532203;
    uint256 constant IC33y = 19284181554103240542859588738713963104558064730061150915875196846838455400202;
    
    uint256 constant IC34x = 21857338780008700862459533002904678051496231226601438919471980062102870905222;
    uint256 constant IC34y = 3162181165857557107956455208621687938114163201485659733697090034359684494963;
    
    uint256 constant IC35x = 18030435880968799586938446245851850883375555870437835535112389707810653422623;
    uint256 constant IC35y = 6125202981561085887220354823672469411551765147522670503222156517716519021152;
    
    uint256 constant IC36x = 20499082633153844200671399519686952035360656473274597348828366396398130332391;
    uint256 constant IC36y = 13503388222737966031252942835877664971660349955260197529036833213452538737513;
    
    uint256 constant IC37x = 9976650628289049705156258459926814563874838911412039589394403452533373103130;
    uint256 constant IC37y = 18608902514616151728316800918889818634703085071916159657497665588826618088908;
    
    uint256 constant IC38x = 16784044963369659319370859422589778652522513891006184311796525491223728540376;
    uint256 constant IC38y = 8419252415782463868730211466135640742417360023777427336012667855758092038197;
    
    uint256 constant IC39x = 19129231125664208150578540534225171515241799100174060685106316051780978435187;
    uint256 constant IC39y = 973856925697381735132603011380839579759091829854878575966871466822882495496;
    
    uint256 constant IC40x = 14184795124277783646007275929709329324671049214116615584525996529650843521730;
    uint256 constant IC40y = 1859538865466811488301745101236111602321138751356202468635736130353767165622;
    
    uint256 constant IC41x = 18975537178323438898430609035810514729962354228862856866418673050920797403688;
    uint256 constant IC41y = 185704805308515213561416117318340746577106200793007151416881264294248110191;
    
    uint256 constant IC42x = 12125731756235036914584256713314621906042150042060439205906356190683778190245;
    uint256 constant IC42y = 348763894998779702959420179945011307061937360949313997838646683785393984577;
    
    uint256 constant IC43x = 7988582464934572644816260889693611174097545127855725643395669489301033617204;
    uint256 constant IC43y = 3364614427630396450372969209269125691931038516189762459489331306338139035298;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[43] calldata _pubSignals) public view returns (bool) {
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
                
                g1_mulAccC(_pVk, IC17x, IC17y, calldataload(add(pubSignals, 512)))
                
                g1_mulAccC(_pVk, IC18x, IC18y, calldataload(add(pubSignals, 544)))
                
                g1_mulAccC(_pVk, IC19x, IC19y, calldataload(add(pubSignals, 576)))
                
                g1_mulAccC(_pVk, IC20x, IC20y, calldataload(add(pubSignals, 608)))
                
                g1_mulAccC(_pVk, IC21x, IC21y, calldataload(add(pubSignals, 640)))
                
                g1_mulAccC(_pVk, IC22x, IC22y, calldataload(add(pubSignals, 672)))
                
                g1_mulAccC(_pVk, IC23x, IC23y, calldataload(add(pubSignals, 704)))
                
                g1_mulAccC(_pVk, IC24x, IC24y, calldataload(add(pubSignals, 736)))
                
                g1_mulAccC(_pVk, IC25x, IC25y, calldataload(add(pubSignals, 768)))
                
                g1_mulAccC(_pVk, IC26x, IC26y, calldataload(add(pubSignals, 800)))
                
                g1_mulAccC(_pVk, IC27x, IC27y, calldataload(add(pubSignals, 832)))
                
                g1_mulAccC(_pVk, IC28x, IC28y, calldataload(add(pubSignals, 864)))
                
                g1_mulAccC(_pVk, IC29x, IC29y, calldataload(add(pubSignals, 896)))
                
                g1_mulAccC(_pVk, IC30x, IC30y, calldataload(add(pubSignals, 928)))
                
                g1_mulAccC(_pVk, IC31x, IC31y, calldataload(add(pubSignals, 960)))
                
                g1_mulAccC(_pVk, IC32x, IC32y, calldataload(add(pubSignals, 992)))
                
                g1_mulAccC(_pVk, IC33x, IC33y, calldataload(add(pubSignals, 1024)))
                
                g1_mulAccC(_pVk, IC34x, IC34y, calldataload(add(pubSignals, 1056)))
                
                g1_mulAccC(_pVk, IC35x, IC35y, calldataload(add(pubSignals, 1088)))
                
                g1_mulAccC(_pVk, IC36x, IC36y, calldataload(add(pubSignals, 1120)))
                
                g1_mulAccC(_pVk, IC37x, IC37y, calldataload(add(pubSignals, 1152)))
                
                g1_mulAccC(_pVk, IC38x, IC38y, calldataload(add(pubSignals, 1184)))
                
                g1_mulAccC(_pVk, IC39x, IC39y, calldataload(add(pubSignals, 1216)))
                
                g1_mulAccC(_pVk, IC40x, IC40y, calldataload(add(pubSignals, 1248)))
                
                g1_mulAccC(_pVk, IC41x, IC41y, calldataload(add(pubSignals, 1280)))
                
                g1_mulAccC(_pVk, IC42x, IC42y, calldataload(add(pubSignals, 1312)))
                
                g1_mulAccC(_pVk, IC43x, IC43y, calldataload(add(pubSignals, 1344)))
                

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
            
            checkField(calldataload(add(_pubSignals, 544)))
            
            checkField(calldataload(add(_pubSignals, 576)))
            
            checkField(calldataload(add(_pubSignals, 608)))
            
            checkField(calldataload(add(_pubSignals, 640)))
            
            checkField(calldataload(add(_pubSignals, 672)))
            
            checkField(calldataload(add(_pubSignals, 704)))
            
            checkField(calldataload(add(_pubSignals, 736)))
            
            checkField(calldataload(add(_pubSignals, 768)))
            
            checkField(calldataload(add(_pubSignals, 800)))
            
            checkField(calldataload(add(_pubSignals, 832)))
            
            checkField(calldataload(add(_pubSignals, 864)))
            
            checkField(calldataload(add(_pubSignals, 896)))
            
            checkField(calldataload(add(_pubSignals, 928)))
            
            checkField(calldataload(add(_pubSignals, 960)))
            
            checkField(calldataload(add(_pubSignals, 992)))
            
            checkField(calldataload(add(_pubSignals, 1024)))
            
            checkField(calldataload(add(_pubSignals, 1056)))
            
            checkField(calldataload(add(_pubSignals, 1088)))
            
            checkField(calldataload(add(_pubSignals, 1120)))
            
            checkField(calldataload(add(_pubSignals, 1152)))
            
            checkField(calldataload(add(_pubSignals, 1184)))
            
            checkField(calldataload(add(_pubSignals, 1216)))
            
            checkField(calldataload(add(_pubSignals, 1248)))
            
            checkField(calldataload(add(_pubSignals, 1280)))
            
            checkField(calldataload(add(_pubSignals, 1312)))
            
            checkField(calldataload(add(_pubSignals, 1344)))
            
            checkField(calldataload(add(_pubSignals, 1376)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
