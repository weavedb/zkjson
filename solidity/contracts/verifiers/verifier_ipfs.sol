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
    uint256 constant deltax1 = 15783562079581309598905050258269857072169309930139220032127098401168766071172;
    uint256 constant deltax2 = 17362509525181724320283208131030103325203576713204725590170738228751343722878;
    uint256 constant deltay1 = 5020225185308198339224312553397494644023832904050519307972959976564098834432;
    uint256 constant deltay2 = 20990636402627182840503346077735601816977001286936814240782956635592163778501;

    
    uint256 constant IC0x = 20945183843295312993381510406405873543669675543384079282436972446171646192720;
    uint256 constant IC0y = 17237562686004945119471557466086768664658136328713341131092714841177141297186;
    
    uint256 constant IC1x = 9423505898126706934630437723037477867791881325803426979561185747498248603884;
    uint256 constant IC1y = 19980675547086534485762092967047281071930684412585892533391176822723961061607;
    
    uint256 constant IC2x = 9098117787360254282896962360660451668658800731413394178703088109544620374706;
    uint256 constant IC2y = 5510384289599141065335697803731597794719247411026196248304191425058052202319;
    
    uint256 constant IC3x = 10157858348015392838514219896337814951103776094796830514775327964182149401263;
    uint256 constant IC3y = 10290698201305501288458690724134198026877469019113455119196376755942796707735;
    
    uint256 constant IC4x = 16387456023518747345700779585609926543684601938400920126297366770639485527744;
    uint256 constant IC4y = 6969925357475327678389523337067180272324042368268176921444709196182180589752;
    
    uint256 constant IC5x = 18608222875374903991714674963489140843485824502635855570080567501622277553931;
    uint256 constant IC5y = 21439197314446815309413338966241723977346666304429917983953410786882619706591;
    
    uint256 constant IC6x = 7188930815253608028403067569056222849750831067993587211577938081607617050792;
    uint256 constant IC6y = 16060810024941034544822411885871368785103660237188173956476054450495897705369;
    
    uint256 constant IC7x = 11157142358621804975190207127260917020349744431385521649848200578369783692560;
    uint256 constant IC7y = 4446002037686484317313045658058956346869513548742108108842057258860927466252;
    
    uint256 constant IC8x = 19704964447357057701156208009184233750296599053699333418678771160762331370362;
    uint256 constant IC8y = 12598327471181748025307748084220511570058088645370911097256342214481488108871;
    
    uint256 constant IC9x = 2841035526247721956857849148001596075805966394043266786154960412687322840899;
    uint256 constant IC9y = 7308811350084248951993974766546452820563620053764252693785731741391586251399;
    
    uint256 constant IC10x = 5246692731708694189735263038679637737147040214246684077924429367638263185984;
    uint256 constant IC10y = 12474542815656075402013443008739499256348503073433227542890742911147050270339;
    
    uint256 constant IC11x = 5207087143250490304861695921770129709292400841027366795168043985229649294532;
    uint256 constant IC11y = 12795854432848274175426792215423979589145995267170197484799859330305467020300;
    
    uint256 constant IC12x = 14770785485535219726343112601745710529061509568083423029076443263466493948039;
    uint256 constant IC12y = 7997144323392572248824139790740780295033082595239979939964766408287970782895;
    
    uint256 constant IC13x = 8954236434613633092460985652304447741597466114031777717556547789980927558460;
    uint256 constant IC13y = 11522439416683825368098385368759016639618032262565503220729956678380039803137;
    
    uint256 constant IC14x = 19225113516182899378997267483170484520589612252754703919070245630846967016296;
    uint256 constant IC14y = 13734831427695481337652042076890535151780465239729388187236450893518752659964;
    
    uint256 constant IC15x = 21807672788421913998774318683618001979413341145663509707780691733601221890851;
    uint256 constant IC15y = 3322476974812840452400541234195317319455934520599654362641433832344879429396;
    
    uint256 constant IC16x = 6038858326650762814556882138406091118226672718538579973671466834848405732886;
    uint256 constant IC16y = 7462166976944399169576395954729490606354570492167222994233258879837697560139;
    
    uint256 constant IC17x = 10752896193761339873794877673548605427662575294137412360562082941713818835130;
    uint256 constant IC17y = 8419036202057621999600064854842902333671302046533978780017838347676724565589;
    
    uint256 constant IC18x = 7529835372384459392217389379310954723547684720318479178096400372505763969736;
    uint256 constant IC18y = 599407436847731544225981025899647962368109269342610334767909365946539944575;
    
    uint256 constant IC19x = 14671131139089441920832999317519046745222376013658501454929888064421013441067;
    uint256 constant IC19y = 7551333900069205832988670137905867851703093936898092626208533133158548165435;
    
    uint256 constant IC20x = 10052415391947314596316300912427098556586109930881105058604320885264092111204;
    uint256 constant IC20y = 16230459258277125092842562046667411025797489171599856928509415553030704016306;
    
    uint256 constant IC21x = 16141849466143854266212343881079318719956148392849965454125492507697919411216;
    uint256 constant IC21y = 2399763278774035510371973982122667280935925217194115939808254304174591599647;
    
    uint256 constant IC22x = 15551000722433821309209967042518995030520724768070131142568618672626780425152;
    uint256 constant IC22y = 7256608103452330288026656620252654642858914397888449797165800516452425938765;
    
    uint256 constant IC23x = 3699176029245504511514640349750169875866651540837213146030872457354535892944;
    uint256 constant IC23y = 20752155395108106196599018410683056316167255558980994549705167115941686379686;
    
    uint256 constant IC24x = 1957768085402537474194676061003905277084980898548872721123080280972426815701;
    uint256 constant IC24y = 2956774374767804921210528629126958636796440500964111152632817982886783422440;
    
    uint256 constant IC25x = 4608360576887101530702115672709530908126991347782886612838663510758725909069;
    uint256 constant IC25y = 8687488241236609691107556468308810472898132753804879993998247134851762421458;
    
    uint256 constant IC26x = 19908615571487599622186614320859879232594754156688901674993619585785502879308;
    uint256 constant IC26y = 3787688232415885509669523720545480662292089345991669484129520739396397443523;
    
    uint256 constant IC27x = 6914177868917920855260226212490833889847359439397798721019435518904665326809;
    uint256 constant IC27y = 13024799210488759105476584594831169021566219042765109908801708398725122932331;
    
    uint256 constant IC28x = 21715885088785354793542792377088033162010280080837260649898036418698529336235;
    uint256 constant IC28y = 15830942736914432461414247612489560406370509083497081164991678848394212448597;
    
    uint256 constant IC29x = 943332426909399743300759848469177139605989903838424889493055874946524569317;
    uint256 constant IC29y = 968817642132232398094813938438366599945938523090994619047441670908511576048;
    
    uint256 constant IC30x = 8057555850363944091115723818770704856299919653543258633891948059136897346620;
    uint256 constant IC30y = 1186649379752569163279803157033069796955654401502974987063315761116585373185;
    
    uint256 constant IC31x = 3258428083677730780033040872954841446069614445067127891120408225202631582102;
    uint256 constant IC31y = 6317074546409385478435697429605219648882355854594045400335549770076165971072;
    
    uint256 constant IC32x = 18295624175657746796954807923922207491794606730028952702437780842155654442281;
    uint256 constant IC32y = 10736854848863902676593130383541512544565428483771759480535152884909410710112;
    
    uint256 constant IC33x = 2488232268623773240106955417946943653056370989165324479640862119258474454020;
    uint256 constant IC33y = 4352999046936633154326025129289110060634150679873685757531149925515267073587;
    
    uint256 constant IC34x = 2918824932744857329246618704287309071375602256462583350326524358108245225911;
    uint256 constant IC34y = 3780854765882320345670662088905295117586601432536146050867757562830832956266;
    
    uint256 constant IC35x = 8057782797846351062191983854125340006050003762843454959894423838850820223220;
    uint256 constant IC35y = 10984166878156620824540087176574738874639066067265166308455890289670490613200;
    
    uint256 constant IC36x = 18430917132631701533322457443069621744865723620340957844031753667763097059982;
    uint256 constant IC36y = 14302590667564392813500574002845504285871650537420257349299326524253904232197;
    
    uint256 constant IC37x = 21608525245613833728546110836677120675012872442307978876227897344024634000437;
    uint256 constant IC37y = 11335592428494225316488189480079277344939953957353321080901299758773360902511;
    
    uint256 constant IC38x = 8344330316064030076426861067403878395364498028939327973852536249276148754328;
    uint256 constant IC38y = 3154690961382192603509691269201633766441063972241950278416241509840879088592;
    
    uint256 constant IC39x = 12292725780667972762145313967882320792380945382505955793916627987232741090657;
    uint256 constant IC39y = 2482587792429412537140727399270273430842709673234023616262344985461071887528;
    
    uint256 constant IC40x = 4996538662594991692179801820819435594782835800723352934774946673327850196729;
    uint256 constant IC40y = 4372483573166797308509357181884602099845778904594737018329822759700594458264;
    
    uint256 constant IC41x = 19520109288260004377507249305787653317664087796022127874450390048114809121046;
    uint256 constant IC41y = 13660441996500744540325169352725621925507936864944084846136676018516119543247;
    
    uint256 constant IC42x = 5136312597397704927498289856778392086157215884789586390079549244675257639878;
    uint256 constant IC42y = 6446117269648328013480904794501119061493451658122968022529255987152419669132;
    
    uint256 constant IC43x = 18623625702651912425649462117049263996288175967812868446198959820516358220636;
    uint256 constant IC43y = 12061405093943129024426588155886401974423778488377020747942310113382607863884;
    
 
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
