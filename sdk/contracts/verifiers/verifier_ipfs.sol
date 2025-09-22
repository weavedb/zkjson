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
    uint256 constant deltax1 = 17011914550185565149300431483363971858315352685291540400532198727349009013553;
    uint256 constant deltax2 = 19192885467003153269775151620238165290765288803827833815667397879323833686524;
    uint256 constant deltay1 = 3140269446733730269840931079149816571897501711158430804872345855224484096307;
    uint256 constant deltay2 = 10256065936953718538228986629916552222168894207581157799664702571980794666054;

    
    uint256 constant IC0x = 12588740490085252404142316279786200693994935905670979501675348810682772870439;
    uint256 constant IC0y = 17209162905337902881975619302888872218470434418965427869767165268046333969631;
    
    uint256 constant IC1x = 16556073821249172448807175516430705852614342726512327754798330442649471190022;
    uint256 constant IC1y = 17922688402854828142659086661320639270637467205009053508498485857883459650954;
    
    uint256 constant IC2x = 534644171215739249176761651317124852371029052898557021159376197936125451768;
    uint256 constant IC2y = 4644736202857419194547660097743499378423038416892521919513420428581913975241;
    
    uint256 constant IC3x = 18832824307103031179683155478473514878361865504519979689024270371187374485359;
    uint256 constant IC3y = 12084055207301937687499040668046380278411840099526065481806091354616509622518;
    
    uint256 constant IC4x = 8053216864643745988691225434391536572326585739795521093608435997695068891377;
    uint256 constant IC4y = 17106971743944157400345726849431774055790519227980851483410577691040647363911;
    
    uint256 constant IC5x = 18747074984662977954849588961279567554168308504012553598343846836378109632921;
    uint256 constant IC5y = 20791229090187369247790781211889663984590363713480684342710005563381547899163;
    
    uint256 constant IC6x = 18403238508301064973717947386026282388575626630751146132419730611211237761050;
    uint256 constant IC6y = 2994313494813165616050424280098996685945151264207915828215711465187400766538;
    
    uint256 constant IC7x = 8388394024472648978108128285554472486463026921764002908138612018861597089423;
    uint256 constant IC7y = 7354985814280599553188546123576585073267624170517351350596921358111571684232;
    
    uint256 constant IC8x = 18774579643376487856141610048215796586620387728124752012694207437791159258683;
    uint256 constant IC8y = 15537252275686612989859672478846407594488085752640648032277988299074224347648;
    
    uint256 constant IC9x = 18630048510978867000832682817408630068094455223288317195864829666862421083009;
    uint256 constant IC9y = 17349343740810157764905905214451318770515623580108513002551997901284784111264;
    
    uint256 constant IC10x = 15958469572247662916494941099814715987817074102874497809785284218422170612504;
    uint256 constant IC10y = 9639040360051641905398476491319237861304444995117679852391421986541082299117;
    
    uint256 constant IC11x = 9652077515221930744146291008048442314348319473522117880600724285877935308969;
    uint256 constant IC11y = 5606134353021132028005002082152887617421155798554292389588650296486067033582;
    
    uint256 constant IC12x = 4426695486041588490140153496533009637317167202167939989532101427256078180366;
    uint256 constant IC12y = 7604949828608226451766585087339147050309151906666549755203127314923951116470;
    
    uint256 constant IC13x = 13686862470965024855148842659348009679205895747809276214398899299611248303409;
    uint256 constant IC13y = 547465327579564620925456940504480072476634819582667374223825908698677661555;
    
    uint256 constant IC14x = 6548821525022245604079621743112031474676250401190337896568404997488729641132;
    uint256 constant IC14y = 9886218640963313317683048971305953520017062023907150094781335124734754474939;
    
    uint256 constant IC15x = 1109261442008461599604269045373403367421940227869051783282406164672012043428;
    uint256 constant IC15y = 6424470857617632376502239621133891314038282559459789351583420561727178723987;
    
    uint256 constant IC16x = 3656503181559215455648900613730561786823797010528134275921409200290564961085;
    uint256 constant IC16y = 1530402425960454396611939823961486517986175391199470660324251764266126046536;
    
    uint256 constant IC17x = 3005070967714696733288303926120057638009004117465795740810322542622411110953;
    uint256 constant IC17y = 8606686843212181688760472356493708628040931435924290010340653238975424010200;
    
    uint256 constant IC18x = 3957187310400110209068683549229630084719551875180334352177130082405272602854;
    uint256 constant IC18y = 1835873793130770472547647567525768434675455951721633858931828184470967440636;
    
    uint256 constant IC19x = 6672162061859184003396219991602644334688719614427483238399389807305348326275;
    uint256 constant IC19y = 228637381882855139057596130369011323342344026015775624695791781728638484748;
    
    uint256 constant IC20x = 6782287425632594661298375177342040742032902133519496006865292009985556604707;
    uint256 constant IC20y = 12113687149297223658768817951582673030138249811281175534489012181583492277676;
    
    uint256 constant IC21x = 10723579550110774298669996030587246651161919276827513899724673298686982792443;
    uint256 constant IC21y = 11498024945946942285017220715316106421817544769986879500250519597765670519984;
    
    uint256 constant IC22x = 7186484181110180467272533917552430311658991686853009400956909115993020240821;
    uint256 constant IC22y = 9849383475308440666042560434082329272253618057997745883081766068853031985791;
    
    uint256 constant IC23x = 8091337959108326609896990956021214069149439795532415593485067786104178869283;
    uint256 constant IC23y = 10283859995154926571907515417238698203149964238589977824702423495365458170738;
    
    uint256 constant IC24x = 1595147607589631373626860392745755811865625203283572619420681478703601374545;
    uint256 constant IC24y = 16265210255721576927127495622871927492022659195824334741062600791158275564650;
    
    uint256 constant IC25x = 17567685981585480327878953261520050430887101341074887785694738994231150400893;
    uint256 constant IC25y = 12913061404754197659502999761217917534078907631337300216706386372380404441265;
    
    uint256 constant IC26x = 4610342014028905399077942132348978117618677459695205442973627012945336320689;
    uint256 constant IC26y = 5788090594725095757445251176811845604754251185119612830540389924687643239183;
    
    uint256 constant IC27x = 3820232163352677596709603487661077267682644227363452429920799910033141599156;
    uint256 constant IC27y = 579789255201044357673280280043030432300381309871716059598190492595497340426;
    
    uint256 constant IC28x = 13020961280331906106276127890007526473411536293586952253837148598492268824641;
    uint256 constant IC28y = 13395024415960679900314491040552451724660267365853412066010463509954214326041;
    
    uint256 constant IC29x = 13750869188969173856297569356108427286556643936164243414257211449618234271327;
    uint256 constant IC29y = 21713662166591109058436096100403704306192299008541784908557462759719383011597;
    
    uint256 constant IC30x = 5828812594292335537006806988287556235858568167783129492562494400870420225249;
    uint256 constant IC30y = 7393912891526525290875762221092954127599721027330243525312416487067628055256;
    
    uint256 constant IC31x = 10078529931577642617600792785829968963406497495639972551494078745347651310934;
    uint256 constant IC31y = 8358372685977148688999045010593445403210495675152635794488698119172596521605;
    
    uint256 constant IC32x = 7633425882617240506138060758842480056236746295894755413366149367627510859314;
    uint256 constant IC32y = 17485267228487928066211438884380441635763089926694729093074325324679778514103;
    
    uint256 constant IC33x = 2617295410419634597685468162778508363200228063030611136131202794023896048121;
    uint256 constant IC33y = 7144464273233817310664496253961451385590759643334292818273568648135740657061;
    
    uint256 constant IC34x = 10452417926481896256895750934494760767689159461190823667991897003845546657484;
    uint256 constant IC34y = 19503475790880779312888768227803715999037830977976255153119326250029094305080;
    
    uint256 constant IC35x = 20101232072719872387922059250811590286423539756203377616366022247924896806898;
    uint256 constant IC35y = 12847183667433784646026571860807932058261441075151981295214798510760641334417;
    
    uint256 constant IC36x = 11337331754647373229637850071636708042910416947255894049022311683987562762307;
    uint256 constant IC36y = 19585221971445798687238025239847416921507876820087072787296821589819692728172;
    
    uint256 constant IC37x = 21813482972859810582024007749043127725999395734527273035869810520575927834371;
    uint256 constant IC37y = 20828708308494280831615487593920088364383484519913573487634489438218047642514;
    
    uint256 constant IC38x = 13715125080980282503227750481054841208999331430920271510223353990681930945342;
    uint256 constant IC38y = 21554217164839463767863129340318519505507681170691300954817971862393118409459;
    
    uint256 constant IC39x = 21143439298659302901852281574017561480524942896524314650594860784774596290844;
    uint256 constant IC39y = 10342701375302852064555943509941639739853654345505772044766168496770912449121;
    
    uint256 constant IC40x = 4006851381577259016286245572461884192975423649583866831417190632163901350733;
    uint256 constant IC40y = 2085691083335943555669673347406648089672311812676598074653124523184289781849;
    
    uint256 constant IC41x = 4607317517201451681764482455014255617469344545059517830871869117632682117465;
    uint256 constant IC41y = 7785807182695707503420940197710920509102341247226532987351312990571812497856;
    
    uint256 constant IC42x = 7773258416118811612796299553380501949630884597445346529940095510860048091978;
    uint256 constant IC42y = 1777947993297553892472891676520554229545788710962283117500183477701782568414;
    
    uint256 constant IC43x = 6416302553933569806709414027831743255090384586181018406431427759499832846264;
    uint256 constant IC43y = 19692472966501327981317747921446961390968332437263567618419648400717102285505;
    
    uint256 constant IC44x = 119354834605867772838453349803407196662294588904579081177639824541277916604;
    uint256 constant IC44y = 13127064540613614836102585793915327680319517073287410940689195368781531916893;
    
    uint256 constant IC45x = 21787653173506589229976873266245096719131722408267114583773166227363598485681;
    uint256 constant IC45y = 4496472803424694229382761144029809263657694958264606486023572644066797581144;
    
    uint256 constant IC46x = 6847975372314916897989740605937790495291387418451688953761286571639276189522;
    uint256 constant IC46y = 11338394337777729253630209048734168082951971137695048384865770649704595032790;
    
    uint256 constant IC47x = 15767238696041289550831455382528396670026751282089850469908700269444032754563;
    uint256 constant IC47y = 14013367493326468215250882295117435930107656554027299152776838771899437770632;
    
    uint256 constant IC48x = 19440416353337250108389974513141895717027092781793627275891617340489015488354;
    uint256 constant IC48y = 7531538467142248126043438835074013413987348358134364361896425766481935194665;
    
    uint256 constant IC49x = 2481751527491075256200893805653785326614087366714279485183879405862990435174;
    uint256 constant IC49y = 10111591707731043843961138292691540323340807035591618412519985037878141378626;
    
    uint256 constant IC50x = 7135090010833954351198392393313289800703707550375557972722559918641268438599;
    uint256 constant IC50y = 17390905627491144680621826752871647619598761717524826136495372978243439319078;
    
    uint256 constant IC51x = 7679230160723636613761568482959083783690342774846618964201901620319534617403;
    uint256 constant IC51y = 10696690223877218415534365571704515963345785661184485214707453377372372786912;
    
    uint256 constant IC52x = 3628678055597047236103001593667213396328949337985456249211088082889681843688;
    uint256 constant IC52y = 17459663676191239973389293458078663015755765306289423497077934704719831728567;
    
    uint256 constant IC53x = 11146266136950528672721926821398631229599465517473282523537712695449130452319;
    uint256 constant IC53y = 11700290275233092123334101747516180264198825290879031988927746696123597263664;
    
    uint256 constant IC54x = 6622140994817476526597722091768498518204234792434099678904877550770870479880;
    uint256 constant IC54y = 9696454439418123656551306828294680344457632583016549730302886390932672192608;
    
    uint256 constant IC55x = 1893914130134687994789983053207374846137248145324836459005454706201522723912;
    uint256 constant IC55y = 10816551517356844904401750502845786621107474809430417686118953088667852660519;
    
    uint256 constant IC56x = 5406879900035805843022522279478148269187102956373612391918821768021704906439;
    uint256 constant IC56y = 18341997058840086841402256118752840150679093894229495612714951400476728269039;
    
    uint256 constant IC57x = 9562472283741412303886423259822695391177341845687154794748818587144168827090;
    uint256 constant IC57y = 20726165936079434954618324848778614952637160857157359418757478418420152829427;
    
    uint256 constant IC58x = 20444919179699410681355337329574845175132174867826502098872853572969177173628;
    uint256 constant IC58y = 17244089778433400094199728073013472709561353015784111244210775773147041895295;
    
    uint256 constant IC59x = 19006139375006819360265875722298808582074241781323192315090358710258125773876;
    uint256 constant IC59y = 21620095059936740691014255197143703191674376300128230300062946309456464722865;
    
    uint256 constant IC60x = 19035094310576783902781275749820373603383698174562239958635697703826192825423;
    uint256 constant IC60y = 12896425593058046432489869707340776706179732434137345283778522329535533845719;
    
    uint256 constant IC61x = 9623394068710863189422171056011476771587599372503857574133228808913791180730;
    uint256 constant IC61y = 8271076587329425676715675316048479239477212129371722797169585048460226949120;
    
    uint256 constant IC62x = 15501422632037825622360280633162246738286045688188180441469829438966251116427;
    uint256 constant IC62y = 4843693175707037817781676766894910669659572402959683191707457653234683323359;
    
    uint256 constant IC63x = 820993791623898896429551196487900255239614360856542402767168769835985598748;
    uint256 constant IC63y = 6313970885764055762271696175295866369370578730486433180889997339715718445766;
    
    uint256 constant IC64x = 18350090997764266605100809652805413095284000744994874221743173076518461317324;
    uint256 constant IC64y = 18317572540083217923055218170449951054772150943380872029051641359678638388460;
    
    uint256 constant IC65x = 8177983479729740541049045824303347822472857546386187628176211928210299103628;
    uint256 constant IC65y = 14416808232276689536718021476520009381108354538726124932744145946074571557618;
    
    uint256 constant IC66x = 6313277718853730255254581353787026683492296067229929777441745161748682191551;
    uint256 constant IC66y = 9680671896229625659271884075158575568167081551137978996211237551633059465176;
    
    uint256 constant IC67x = 11263136121294147921272462791054455522278411635659614005347649908208961315937;
    uint256 constant IC67y = 1261220074099982985540775846340262309512095916327101144240209003287400640667;
    
    uint256 constant IC68x = 19875746582183334749301379292147507882634109449172854188493603375049810011434;
    uint256 constant IC68y = 10607915763358604916773218345733059621893378881864770650910868678043190012293;
    
    uint256 constant IC69x = 11079509618383098011474767273713382764335101365783997856851877435006214474189;
    uint256 constant IC69y = 1974168893409361068876802347678292656131729906552813349009427669038448733562;
    
    uint256 constant IC70x = 19239625737280097873241026655132201842823308142801489173055816185098445577393;
    uint256 constant IC70y = 21333565656761595663730855059646223065031005338385081433074872588063542072021;
    
    uint256 constant IC71x = 6435639343307659231143232515514395794220400759140504263568217913039335140084;
    uint256 constant IC71y = 13624643847295680469114417237617081718784222229689910711215198066306826533540;
    
    uint256 constant IC72x = 12274424478133859369446385070319583840455073575603081029495409015804150167949;
    uint256 constant IC72y = 15540250043470182584689511198279554857661391290907252749383733912420567853598;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[72] calldata _pubSignals) public view returns (bool) {
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
                
                g1_mulAccC(_pVk, IC44x, IC44y, calldataload(add(pubSignals, 1376)))
                
                g1_mulAccC(_pVk, IC45x, IC45y, calldataload(add(pubSignals, 1408)))
                
                g1_mulAccC(_pVk, IC46x, IC46y, calldataload(add(pubSignals, 1440)))
                
                g1_mulAccC(_pVk, IC47x, IC47y, calldataload(add(pubSignals, 1472)))
                
                g1_mulAccC(_pVk, IC48x, IC48y, calldataload(add(pubSignals, 1504)))
                
                g1_mulAccC(_pVk, IC49x, IC49y, calldataload(add(pubSignals, 1536)))
                
                g1_mulAccC(_pVk, IC50x, IC50y, calldataload(add(pubSignals, 1568)))
                
                g1_mulAccC(_pVk, IC51x, IC51y, calldataload(add(pubSignals, 1600)))
                
                g1_mulAccC(_pVk, IC52x, IC52y, calldataload(add(pubSignals, 1632)))
                
                g1_mulAccC(_pVk, IC53x, IC53y, calldataload(add(pubSignals, 1664)))
                
                g1_mulAccC(_pVk, IC54x, IC54y, calldataload(add(pubSignals, 1696)))
                
                g1_mulAccC(_pVk, IC55x, IC55y, calldataload(add(pubSignals, 1728)))
                
                g1_mulAccC(_pVk, IC56x, IC56y, calldataload(add(pubSignals, 1760)))
                
                g1_mulAccC(_pVk, IC57x, IC57y, calldataload(add(pubSignals, 1792)))
                
                g1_mulAccC(_pVk, IC58x, IC58y, calldataload(add(pubSignals, 1824)))
                
                g1_mulAccC(_pVk, IC59x, IC59y, calldataload(add(pubSignals, 1856)))
                
                g1_mulAccC(_pVk, IC60x, IC60y, calldataload(add(pubSignals, 1888)))
                
                g1_mulAccC(_pVk, IC61x, IC61y, calldataload(add(pubSignals, 1920)))
                
                g1_mulAccC(_pVk, IC62x, IC62y, calldataload(add(pubSignals, 1952)))
                
                g1_mulAccC(_pVk, IC63x, IC63y, calldataload(add(pubSignals, 1984)))
                
                g1_mulAccC(_pVk, IC64x, IC64y, calldataload(add(pubSignals, 2016)))
                
                g1_mulAccC(_pVk, IC65x, IC65y, calldataload(add(pubSignals, 2048)))
                
                g1_mulAccC(_pVk, IC66x, IC66y, calldataload(add(pubSignals, 2080)))
                
                g1_mulAccC(_pVk, IC67x, IC67y, calldataload(add(pubSignals, 2112)))
                
                g1_mulAccC(_pVk, IC68x, IC68y, calldataload(add(pubSignals, 2144)))
                
                g1_mulAccC(_pVk, IC69x, IC69y, calldataload(add(pubSignals, 2176)))
                
                g1_mulAccC(_pVk, IC70x, IC70y, calldataload(add(pubSignals, 2208)))
                
                g1_mulAccC(_pVk, IC71x, IC71y, calldataload(add(pubSignals, 2240)))
                
                g1_mulAccC(_pVk, IC72x, IC72y, calldataload(add(pubSignals, 2272)))
                

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
            
            checkField(calldataload(add(_pubSignals, 1408)))
            
            checkField(calldataload(add(_pubSignals, 1440)))
            
            checkField(calldataload(add(_pubSignals, 1472)))
            
            checkField(calldataload(add(_pubSignals, 1504)))
            
            checkField(calldataload(add(_pubSignals, 1536)))
            
            checkField(calldataload(add(_pubSignals, 1568)))
            
            checkField(calldataload(add(_pubSignals, 1600)))
            
            checkField(calldataload(add(_pubSignals, 1632)))
            
            checkField(calldataload(add(_pubSignals, 1664)))
            
            checkField(calldataload(add(_pubSignals, 1696)))
            
            checkField(calldataload(add(_pubSignals, 1728)))
            
            checkField(calldataload(add(_pubSignals, 1760)))
            
            checkField(calldataload(add(_pubSignals, 1792)))
            
            checkField(calldataload(add(_pubSignals, 1824)))
            
            checkField(calldataload(add(_pubSignals, 1856)))
            
            checkField(calldataload(add(_pubSignals, 1888)))
            
            checkField(calldataload(add(_pubSignals, 1920)))
            
            checkField(calldataload(add(_pubSignals, 1952)))
            
            checkField(calldataload(add(_pubSignals, 1984)))
            
            checkField(calldataload(add(_pubSignals, 2016)))
            
            checkField(calldataload(add(_pubSignals, 2048)))
            
            checkField(calldataload(add(_pubSignals, 2080)))
            
            checkField(calldataload(add(_pubSignals, 2112)))
            
            checkField(calldataload(add(_pubSignals, 2144)))
            
            checkField(calldataload(add(_pubSignals, 2176)))
            
            checkField(calldataload(add(_pubSignals, 2208)))
            
            checkField(calldataload(add(_pubSignals, 2240)))
            
            checkField(calldataload(add(_pubSignals, 2272)))
            
            checkField(calldataload(add(_pubSignals, 2304)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
