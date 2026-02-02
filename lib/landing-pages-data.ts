// Landing pages SEO data for LovelyGirls.cz
// Each landing page has unique, keyword-rich content for Google indexing

export interface LandingPage {
  slug: string;
  locale: string;
  title: string;
  metaDescription: string;
  h1: string;
  leadText: string;
  whyChooseUs: string[];
  girlsHeading: string;
  girlsFilter: { field: string; value: string } | null;
  contentSections: { heading: string; text: string }[];
  howItWorks: { step: string; text: string }[];
  faq: { question: string; answer: string }[];
  internalLinks: { text: string; href: string }[];
}

export const LANDING_PAGES: LandingPage[] = [
  // =============================================
  // CZECH LANDING PAGES
  // =============================================
  {
    slug: 'escort-praha',
    locale: 'cs',
    title: 'Escort Praha | Prémiová Escort Agentura v Praze | LovelyGirls',
    metaDescription: 'Hledáte escort služby v Praze? LovelyGirls je prémiová escort agentura Praha s ověřenými dívkami. Diskrétní setkání, rychlá rezervace přes WhatsApp. Escort Praha 24/7.',
    h1: 'Escort Praha – Prémiová Escort Agentura',
    leadText: 'Vítejte u LovelyGirls, vaší důvěryhodné escort agentury v Praze. Nabízíme escort služby Praha na nejvyšší úrovni – ověřené dívky, absolutní diskrétnost a rezervaci během pár minut. Ať hledáte společnici na večeři, kulturní akci nebo intimní setkání, naše escort Praha vám splní každé přání.',
    whyChooseUs: [
      'Ověřené profily – každá dívka prochází osobním pohovorem a verifikací fotografií, takže víte přesně, kdo za vámi přijde.',
      'Diskrétní escort služby Praha – komunikujeme šifrovaně přes WhatsApp a Telegram, vaše soukromí je naší prioritou.',
      'Escort agentura Praha s dostupností 24/7 – objednávejte kdykoli, naše recepce reaguje do 5 minut.',
      'Široký výběr – blondýnky, brunetky, exotické krásky i české dívky. Vyberte si podle svého vkusu.'
    ],
    girlsHeading: 'Naše escort dívky v Praze',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Escort služby Praha pro náročné gentlemany',
        text: 'Praha je město, kde se mísí historie s moderním životním stylem – a naše escort služby Praha do tohoto obrazu dokonale zapadají. Ať jste obchodník na služební cestě, turista objevující krásy hlavního města nebo Pražan hledající diskrétní společnost, LovelyGirls má pro vás tu pravou společnici.\n\nNaše <a href="/cs/divky">dívky</a> nabízejí širokou škálu služeb – od klasického doprovodu na společenské události přes romantické večeře až po intimní privátní setkání. Každá escort Praha v našem portfoliu je pečlivě vybraná, profesionální a dbá na vaše pohodlí.\n\nPodívejte se na náš <a href="/cs/cenik">ceník</a>, kde najdete transparentní ceny bez skrytých poplatků. Vše je přímočaré – vyberete si dívku, napíšete nám a do pár minut máte potvrzenou rezervaci.'
      },
      {
        heading: 'Jak funguje naše escort agentura Praha',
        text: 'Proces je jednoduchý a diskrétní. Prohlédněte si profily našich <a href="/cs/divky">dívek</a>, vyberte si podle svých preferencí a kontaktujte nás. Můžete nám napsat přes WhatsApp, Telegram nebo zavolat. Potvrzení objednávky obvykle trvá méně než 5 minut.\n\nNabízíme jak incall (setkání v našich prostorách), tak outcall (dívka přijede k vám do hotelu nebo bytu). Kompletní přehled <a href="/cs/sluzby">služeb</a> najdete na naší stránce.'
      }
    ],
    howItWorks: [
      { step: '1. Vyberte si dívku', text: 'Prohlédněte si profily s fotkami, parametry a nabízenými službami.' },
      { step: '2. Kontaktujte nás', text: 'Napište nám přes WhatsApp, Telegram nebo zavolejte na naši linku.' },
      { step: '3. Potvrzení', text: 'Recepce potvrdí dostupnost dívky a dohodne čas a místo setkání.' },
      { step: '4. Užijte si', text: 'Setkejte se s vaší vybranou společnicí a užijte si nezapomenutelný zážitek.' }
    ],
    faq: [
      { question: 'Kolik stojí escort služby v Praze?', answer: 'Ceny se liší podle délky setkání a vybrané dívky. Základní sazby najdete v našem ceníku. Hodinové setkání začíná od 3 000 Kč. Vždy víte předem, kolik zaplatíte – žádné skryté poplatky.' },
      { question: 'Jsou vaše escort dívky ověřené?', answer: 'Ano, každá dívka prochází osobním pohovorem a verifikací fotografií. Garantujeme, že fotky na profilu odpovídají skutečnosti. Naše escort agentura Praha klade důraz na kvalitu a bezpečnost.' },
      { question: 'Nabízíte outcall escort Praha?', answer: 'Ano, naše dívky jezdí do hotelů, apartmánů i soukromých bytů po celé Praze. Outcall služba je k dispozici 24/7 s příplatkem za dopravu podle vzdálenosti.' },
      { question: 'Jak rychle mohu mít rezervaci?', answer: 'Obvykle do 5–15 minut od kontaktování. V případě akutní poptávky je možné zajistit setkání i do 30 minut v centru Prahy.' }
    ],
    internalLinks: [
      { text: 'všechny dívky', href: '/cs/divky' },
      { text: 'naše služby', href: '/cs/sluzby' },
      { text: 'ceník', href: '/cs/cenik' },
      { text: 'často kladené otázky', href: '/cs/faq' }
    ]
  },

  {
    slug: 'spolecnice-praha',
    locale: 'cs',
    title: 'Společnice Praha | Luxusní Privátní Společnice | LovelyGirls',
    metaDescription: 'Luxusní společnice Praha pro diskrétní setkání i společenské akce. Privátní společnice Praha – elegantní, vzdělané a ověřené. Rezervace přes WhatsApp.',
    h1: 'Společnice Praha – Luxusní a Privátní',
    leadText: 'Hledáte luxusní společnici v Praze, která vám zpříjemní večer, doprovodí vás na firemní akci nebo s vámi stráví nezapomenutelné privátní chvíle? LovelyGirls nabízí privátní společnice Praha, které jsou nejen krásné, ale i inteligentní, vtipné a diskrétní.',
    whyChooseUs: [
      'Luxusní společnice Praha – elegantní dívky, které se skvěle hodí na společenské akce, večeře i soukromá setkání.',
      'Privátní společnice s ověřenými profily – žádné nepříjemné překvapení, fotky odpovídají realitě.',
      'Diskrétnost na prvním místě – šifrovaná komunikace, žádné záznamy, absolutní soukromí.',
      'Široký výběr – od mladých studentek po sofistikované ženy, každý si najde tu svou.'
    ],
    girlsHeading: 'Naše společnice v Praze',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Privátní společnice Praha pro každou příležitost',
        text: 'Naše společnice Praha nejsou jen krásné tváře – jsou to ženy, které umí vést konverzaci, přizpůsobit se jakékoli situaci a zajistit, že se budete cítit výjimečně. Ať potřebujete doprovod na galavečer, romantickou večeři ve vyhlášené restauraci nebo privátní setkání za zavřenými dveřmi, naše luxusní společnice jsou připraveny.\n\nKaždá z našich <a href="/cs/divky">dívek</a> je pečlivě vybraná – hodnotíme nejen vzhled, ale i osobnost, komunikační dovednosti a profesionalitu. Proto se k nám naši klienti rádi vracejí.'
      },
      {
        heading: 'Proč volit luxusní společnici z LovelyGirls?',
        text: 'Na trhu je mnoho agentur, ale LovelyGirls se liší kvalitou. Naše společnice Praha procházejí důkladným výběrovým řízením. Investujeme do toho, aby každé setkání bylo perfektní – od prvního kontaktu až po rozloučení.\n\nPodívejte se na kompletní <a href="/cs/sluzby">nabídku služeb</a> a vyberte si společnici podle svých představ. Transparentní <a href="/cs/cenik">ceník</a> vám usnadní rozhodování.'
      }
    ],
    howItWorks: [
      { step: '1. Prohlédněte profily', text: 'Na stránce s dívkami najdete fotky, popis osobnosti a nabízené služby.' },
      { step: '2. Napište nám', text: 'Kontaktujte nás přes WhatsApp nebo Telegram a sdělte své přání.' },
      { step: '3. Domluvíme detaily', text: 'Recepce zařídí vše – čas, místo a případné speciální požadavky.' },
      { step: '4. Setkání', text: 'Vaše společnice dorazí přesně a připravená udělat vám radost.' }
    ],
    faq: [
      { question: 'Jaký je rozdíl mezi společnicí a escort?', answer: 'Společnice klade důraz na celkový zážitek – konverzaci, doprovod, eleganci. Naše společnice Praha jsou ideální pro gentlemany, kteří hledají víc než jen fyzický kontakt. Samozřejmě záleží na individuální dohodě.' },
      { question: 'Mohu si objednat společnici na celý večer?', answer: 'Samozřejmě. Nabízíme setkání od jedné hodiny až po celou noc. Čím delší setkání, tím lepší cena – podrobnosti najdete v ceníku.' },
      { question: 'Jsou společnice diskrétní?', answer: 'Absolutně. Diskrétnost je základ naší práce. Vaše identita a detaily setkání zůstávají přísně důvěrné.' }
    ],
    internalLinks: [
      { text: 'prohlédnout dívky', href: '/cs/divky' },
      { text: 'naše služby', href: '/cs/sluzby' },
      { text: 'ceník služeb', href: '/cs/cenik' }
    ]
  },

  {
    slug: 'sex-praha',
    locale: 'cs',
    title: 'Sex Praha | Sexy Holky na Sex v Praze | LovelyGirls',
    metaDescription: 'Sex Praha s krásnými holkami. Sexy holky Praha – ověřené, diskrétní, dostupné 24/7. Rychlá rezervace přes WhatsApp. Nejlepší holky na sex v Praze.',
    h1: 'Sex Praha – Nejkrásnější Holky v Praze',
    leadText: 'Toužíte po nezávazném sexu v Praze s krásnými a ověřenými holkami? LovelyGirls vám nabízí sexy holky Praha, které jsou vášnivé, otevřené a připravené splnit vaše fantazie. Žádné komplikace, žádné hry – jen čistý požitek s holkami, které milují to, co dělají.',
    whyChooseUs: [
      'Sexy holky Praha – atraktivní dívky s dokonalými postavami a otevřenou myslí.',
      'Ověřené profily – fotky odpovídají realitě, žádné falešné inzeráty.',
      'Sex Praha 24/7 – k dispozici kdykoliv, i uprostřed noci.',
      'Široká škála služeb – od klasiky po speciální přání, vše najdete v naší nabídce.'
    ],
    girlsHeading: 'Sexy holky dostupné v Praze',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Holky na sex Praha – bez kompromisů',
        text: 'Praha nabízí mnoho možností, ale pokud hledáte kvalitní holky na sex, LovelyGirls je ta správná volba. Naše sexy holky Praha jsou nejen krásné, ale i zkušené a vášnivé. Ať preferujete blondýnky, brunetky, zrzky nebo exotické krásky – máme pro vás tu pravou.\n\nProhlédněte si naše <a href="/cs/divky">dívky</a> a vyberte si podle svého vkusu. Každý profil obsahuje reálné fotky, popis služeb a parametry. Rozhodování je jednoduché a rychlé.'
      },
      {
        heading: 'Diskrétní a bezpečný sex v Praze',
        text: 'Bezpečnost a diskrétnost jsou pro nás klíčové. Všechny naše holky dbají na hygienu a ochranu. Komunikace probíhá výhradně přes šifrované kanály – WhatsApp nebo Telegram.\n\nNabízíme jak incall (ve vlastních prostorách), tak outcall (sex Praha u vás v hotelu nebo bytě). Kompletní <a href="/cs/sluzby">seznam služeb</a> a <a href="/cs/cenik">ceník</a> najdete na našem webu.'
      }
    ],
    howItWorks: [
      { step: '1. Vyberte holku', text: 'Prohlédněte profily, fotky a služby jednotlivých dívek.' },
      { step: '2. Kontaktujte nás', text: 'WhatsApp, Telegram nebo telefon – jak vám to vyhovuje.' },
      { step: '3. Dohodněte se', text: 'Místo, čas a preferované služby – vše vyřídíme za pár minut.' },
      { step: '4. Užijte si', text: 'Setkejte se s vaší holkou a nechte se unést.' }
    ],
    faq: [
      { question: 'Jsou fotky dívek reálné?', answer: 'Ano, všechny fotky jsou ověřené. Každá dívka prochází verifikací, abychom garantovali, že dostanete přesně to, co vidíte na profilu.' },
      { question: 'Jaké služby holky nabízejí?', answer: 'Nabídka se liší dívku od dívky. Základem je klasický sex, orál a masáže. Speciální služby (análka, GFE, duo) nabízí vybrané dívky – podrobnosti najdete v profilu.' },
      { question: 'Mohu zaplatit kartou?', answer: 'Preferujeme hotovostní platbu při setkání. Je to nejdiskrétnější způsob úhrady. V některých případech je možná platba převodem předem.' },
      { question: 'Je to bezpečné?', answer: 'Absolutně. Naše dívky dbají na ochranu a hygienu. Vaše soukromí je chráněno šifrovanou komunikací a žádnými záznamy.' }
    ],
    internalLinks: [
      { text: 'všechny holky', href: '/cs/divky' },
      { text: 'služby', href: '/cs/sluzby' },
      { text: 'ceník', href: '/cs/cenik' }
    ]
  },

  {
    slug: 'eroticke-masaze-praha',
    locale: 'cs',
    title: 'Erotické Masáže Praha | Tantra Masáž s Happy End | LovelyGirls',
    metaDescription: 'Erotické masáže Praha od krásných masérek. Tantra masáž Praha, masáže s happy end, nuru masáž. Profesionální masérky, diskrétní prostředí. Rezervace 24/7.',
    h1: 'Erotické Masáže Praha – Tantra a Happy End',
    leadText: 'Objevte svět smyslných erotických masáží v Praze. Naše profesionální masérky vám nabídnou tantra masáž Praha, nuru masáž, body-to-body masáž a samozřejmě masáže s happy end Praha. Uvolněte se, zapomeňte na stres a nechte se hýčkat zručnýma rukama krásných žen.',
    whyChooseUs: [
      'Erotické masáže Praha od zkušených masérek – jemné doteky, aromatické oleje a smyslná atmosféra.',
      'Tantra masáž Praha – hluboký zážitek propojující tělo a mysl, prováděný certifikovanými masérkami.',
      'Masáže s happy end Praha – relaxace s dokonalým vyvrcholením, diskrétně a profesionálně.',
      'Příjemné a čisté prostory – klimatizované pokoje, sprcha, vše pro váš komfort.'
    ],
    girlsHeading: 'Naše masérky v Praze',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Druhy erotických masáží v Praze',
        text: 'V LovelyGirls nabízíme několik typů erotických masáží, aby si každý vybral to své:\n\n<strong>Tantra masáž Praha</strong> – duchovní a smyslná masáž, která probouzí vaši energii a přináší hlubokou relaxaci. Naše masérky ovládají tradiční tantrické techniky.\n\n<strong>Nuru masáž</strong> – japonská technika masáže celým tělem s použitím speciálního gelu. Intenzivní kontakt kůže na kůži.\n\n<strong>Body-to-body masáž</strong> – masérka používá celé své tělo k masírování vašeho. Extrémně smyslný zážitek.\n\n<strong>Masáže s happy end</strong> – klasická relaxační masáž zakončená příjemným vyvrcholením.\n\nVšechny typy masáží najdete v naší <a href="/cs/sluzby">nabídce služeb</a>.'
      },
      {
        heading: 'Proč si vybrat erotickou masáž u nás?',
        text: 'Na rozdíl od anonymních masážních salónů nabízíme osobní přístup. Vyberete si konkrétní masérku z naší galerie <a href="/cs/divky">dívek</a>, domluvíte si termín a užíváte si. Žádná překvapení, žádné skryté poplatky – vše je transparentní.\n\nNavíc kombinujeme masáž s dalšími službami dle vašeho přání. <a href="/cs/cenik">Ceník</a> najdete online.'
      }
    ],
    howItWorks: [
      { step: '1. Vyberte masérku', text: 'Prohlédněte si profily a vyberte dívku, která vás zaujme.' },
      { step: '2. Zvolte typ masáže', text: 'Tantra, nuru, body-to-body nebo klasická s happy end.' },
      { step: '3. Rezervujte termín', text: 'Kontaktujte nás přes WhatsApp nebo Telegram.' },
      { step: '4. Relaxujte', text: 'Přijďte, svlékněte se a nechte se hýčkat.' }
    ],
    faq: [
      { question: 'Jak dlouho trvá erotická masáž?', answer: 'Standardní masáž trvá 60 minut. Nabízíme i zkrácené 30minutové a prodloužené 90minutové varianty. Čím delší masáž, tím hlubší relaxace.' },
      { question: 'Co znamená masáž s happy end?', answer: 'Happy end je příjemné zakončení masáže manuální stimulací (ruční práce). Je to přirozená součást erotické masáže a je zahrnuta v ceně.' },
      { question: 'Musím si přinést vlastní ručník?', answer: 'Ne, vše potřebné je k dispozici – ručníky, sprcha, oleje. Stačí přijít.' },
      { question: 'Je možné kombinovat masáž s dalšími službami?', answer: 'Ano, mnoho klientů kombinuje masáž s klasickým sexem nebo orálním sexem. Záleží na nabídce konkrétní masérky – podrobnosti najdete v profilu.' }
    ],
    internalLinks: [
      { text: 'naše masérky', href: '/cs/divky' },
      { text: 'kompletní služby', href: '/cs/sluzby' },
      { text: 'ceník masáží', href: '/cs/cenik' }
    ]
  },

  {
    slug: 'vip-escort-praha',
    locale: 'cs',
    title: 'VIP Escort Praha | Luxusní a Exkluzivní Společnice | LovelyGirls',
    metaDescription: 'VIP escort Praha pro nejnáročnější klienty. Luxusní escort s exkluzivními společnicemi Praha. Prémiový servis, absolutní diskrétnost. Rezervace 24/7.',
    h1: 'VIP Escort Praha – Luxus a Exkluzivita',
    leadText: 'Pro gentlemany, kteří hledají to nejlepší, nabízíme VIP escort Praha – exkluzivní společnice, které předčí vaše očekávání. Luxusní escort není jen o kráse, ale o celkovém zážitku – od prvního kontaktu až po poslední polibek. Naše exkluzivní společnice Praha jsou ztělesněním elegance, sofistikovanosti a vášně.',
    whyChooseUs: [
      'VIP escort Praha – top modelky, miss a ženy s výjimečným charismatem.',
      'Luxusní escort na míru – přizpůsobíme vše vašim přáním, od outfitu po scénář večera.',
      'Exkluzivní společnice Praha s jazykovými znalostmi – angličtina, němčina, ruština.',
      'Absolutní diskrétnost – NDA na požádání, žádné digitální stopy.'
    ],
    girlsHeading: 'VIP společnice v Praze',
    girlsFilter: { field: 'badge_type', value: 'top' },
    contentSections: [
      {
        heading: 'Co znamená VIP escort Praha?',
        text: 'VIP escort Praha je prémiová služba pro klienty, kteří odmítají kompromisy. Naše exkluzivní společnice jsou pečlivě vybrané ženy, které kombinují přirozený šarm s dokonalým vystupováním. Jsou ideální pro:\n\n• Doprovod na prestižní společenské akce a galavečery\n• Obchodní večeře, kde potřebujete udělat dojem\n• Víkendové pobyty v luxusních hotelech\n• Privátní setkání na nejvyšší úrovni\n\nProhlédněte si naše <a href="/cs/divky">top dívky</a> a vyberte si svou VIP společnici.'
      },
      {
        heading: 'Luxusní escort bez kompromisů',
        text: 'U LovelyGirls chápeme, že luxusní escort znamená víc než jen hezkou tvář. Proto naše VIP společnice procházejí rozšířeným výběrovým řízením – hodnotíme vzhled, inteligenci, jazykové dovednosti, společenské vystupování i schopnost vytvořit autentické propojení.\n\nCeny VIP služeb najdete v <a href="/cs/cenik">ceníku</a>. Nabízíme také balíčky pro delší setkání a speciální příležitosti.'
      }
    ],
    howItWorks: [
      { step: '1. Kontaktujte VIP recepci', text: 'Napište nám vaše požadavky – typ dívky, účel setkání, délku.' },
      { step: '2. Personalizovaný výběr', text: 'Představíme vám handpicked společnice, které odpovídají vašim kritériím.' },
      { step: '3. Příprava', text: 'Dívka se připraví podle vašich požadavků – outfit, parfém, styling.' },
      { step: '4. VIP zážitek', text: 'Užijte si prémiový zážitek, na který budete dlouho vzpomínat.' }
    ],
    faq: [
      { question: 'Kolik stojí VIP escort Praha?', answer: 'VIP služby začínají od 5 000 Kč za hodinu. Cena závisí na konkrétní společnici a délce setkání. Pro víkendové pobyty a speciální požadavky poskytujeme individuální kalkulaci.' },
      { question: 'V čem se liší VIP escort od běžného?', answer: 'VIP společnice jsou crème de la crème – modelky, ženy s vysokoškolským vzděláním, vícejazyčné. Nabízejí kompletní doprovod na nejvyšší úrovni včetně společenských akcí.' },
      { question: 'Mohu si objednat VIP escort na více dní?', answer: 'Samozřejmě. Nabízíme balíčky na celou noc, víkend i delší období. Kontaktujte naši VIP recepci pro individuální nabídku.' }
    ],
    internalLinks: [
      { text: 'VIP dívky', href: '/cs/divky' },
      { text: 'prémiové služby', href: '/cs/sluzby' },
      { text: 'VIP ceník', href: '/cs/cenik' }
    ]
  },

  {
    slug: 'outcall-escort-praha',
    locale: 'cs',
    title: 'Outcall Escort Praha | Escort do Hotelu | Hotel Escort Praha | LovelyGirls',
    metaDescription: 'Outcall escort Praha – dívka přijede přímo k vám do hotelu nebo bytu. Hotel escort Praha s diskrétním příjezdem. Escort do hotelu Praha 24/7.',
    h1: 'Outcall Escort Praha – Přímo k Vám do Hotelu',
    leadText: 'Nechcete nikam cestovat? S naší outcall escort Praha přijede krásná společnice přímo k vám – do hotelu, apartmánu nebo soukromého bytu. Hotel escort Praha je naše specialita – diskrétní příjezd, žádné komplikace, maximální pohodlí ve vašem prostředí.',
    whyChooseUs: [
      'Outcall escort Praha – dívka přijede kamkoli v Praze během 30–60 minut.',
      'Hotel escort Praha – zkušenosti s příjezdem do všech pražských hotelů, diskrétně a bez problémů.',
      'Escort do hotelu bez starostí – dívka ví, jak se chovat v lobby, výtahu i na recepci.',
      'Dostupnost 24/7 – i pozdě v noci se k vám dostaneme.'
    ],
    girlsHeading: 'Dívky pro outcall v Praze',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Hotel escort Praha – jak to funguje?',
        text: 'Outcall escort Praha je jednoduchá. Vyberete si <a href="/cs/divky">dívku</a>, kontaktujete nás a sdělíte adresu hotelu nebo bytu. Dívka se připraví a přijede přímo k vám. V hotelu se chová diskrétně – vypadá jako běžný host nebo vaše známá.\n\nNaše dívky mají zkušenosti s hotel escort Praha ve všech typech ubytování – od butiků po pětihvězdičkové hotely. Znají etiketu a nepřitáhnou pozornost.'
      },
      {
        heading: 'Outcall escort Praha do jakékoli lokality',
        text: 'Pokrýváme celou Prahu a blízké okolí. Nejčastější destinace jsou hotely v centru (Praha 1, 2), ale dívky jezdí i do okrajových částí. Dopravné se liší podle vzdálenosti.\n\nAlternativně nabízíme i incall – setkání v našich diskrétních prostorách. Podrobnosti o obou variantách najdete v <a href="/cs/sluzby">přehledu služeb</a> a <a href="/cs/cenik">ceníku</a>.'
      }
    ],
    howItWorks: [
      { step: '1. Vyberte si dívku', text: 'Prohlédněte si profily a vyberte ideální společnici.' },
      { step: '2. Sdělte adresu', text: 'Napište nám název hotelu/adresu a preferovaný čas.' },
      { step: '3. Dívka se připraví', text: 'Oblékne se podle vašeho přání a vyrazí za vámi.' },
      { step: '4. Diskrétní příjezd', text: 'Dívka dorazí přímo na pokoj – diskrétně a včas.' }
    ],
    faq: [
      { question: 'Kolik stojí outcall escort Praha?', answer: 'K základní ceně setkání se připočítá dopravné 300–500 Kč podle lokality. Pro centrum Prahy je dopravné minimální. Kompletní ceník najdete online.' },
      { question: 'Mohou dívky přijet do jakéhokoli hotelu?', answer: 'Ano, naše dívky jezdí do všech hotelů v Praze. V některých hotelech může být vyžadována registrace hosta na recepci – poradíme vám, jak to zvládnout diskrétně.' },
      { question: 'Jak dlouho trvá, než dívka dorazí?', answer: 'V centru Prahy obvykle 20–40 minut, v okrajových částech 40–60 minut. Při předchozí domluvě je možné přesné časování.' }
    ],
    internalLinks: [
      { text: 'naše dívky', href: '/cs/divky' },
      { text: 'služby', href: '/cs/sluzby' },
      { text: 'ceník', href: '/cs/cenik' }
    ]
  },

  {
    slug: 'girlfriend-experience-praha',
    locale: 'cs',
    title: 'Girlfriend Experience Praha | GFE Escort | Romantický Escort | LovelyGirls',
    metaDescription: 'GFE Praha – girlfriend experience s krásnou společnicí. Romantický escort Praha jako s pravou přítelkyní. Polibky, mazlení, intimita. Rezervace přes WhatsApp.',
    h1: 'Girlfriend Experience Praha – Romantický Escort',
    leadText: 'Girlfriend experience Praha (GFE) je víc než jen setkání – je to autentický zážitek jako s opravdovou přítelkyní. Francouzské polibky, objímání, mazlení, intimní rozhovory a vášnivý sex. Naše GFE společnice vytvářejí atmosféru, ve které se budete cítit milovaní a žádaní.',
    whyChooseUs: [
      'GFE Praha – pravý girlfriend experience s polibky, mazlením a autentickou intimitou.',
      'Romantický escort Praha – společnice, které umí vytvořit opravdové propojení.',
      'Žádný spěch – GFE setkání jsou o kvalitě stráveného času, ne o hodinách.',
      'Vybrané dívky – GFE nabízejí pouze ty, které to baví a umí to.'
    ],
    girlsHeading: 'GFE společnice v Praze',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Co je girlfriend experience (GFE)?',
        text: 'GFE neboli girlfriend experience je styl escort setkání, který simuluje rande s přítelkyní. Na rozdíl od klasického escort, kde je důraz na fyzický kontakt, GFE Praha zahrnuje celý emocionální spektrum:\n\n• <strong>Francouzské polibky</strong> – vášnivé líbání jako s partnerkou\n• <strong>Mazlení a objímání</strong> – physical closeness a intimita\n• <strong>Romantická atmosféra</strong> – společná sprcha, víno, konverzace\n• <strong>Pomalý, vášnivý sex</strong> – bez spěchu, s důrazem na oboustranné potěšení\n\nNaše <a href="/cs/divky">GFE dívky</a> jsou mistryně v tom, aby vám daly pocit výjimečnosti.'
      },
      {
        heading: 'Pro koho je romantický escort Praha?',
        text: 'GFE Praha je ideální pro muže, kteří hledají víc než mechanický sex. Je pro ty, kteří si chtějí užít celý zážitek – od prvního úsměvu po poslední polibek. Často si GFE objednávají:\n\n• Podnikatelé, kteří cestují sami a chybí jim ženská blízkost\n• Muži po rozchodu, kteří touží po ženské pozornosti\n• Ti, kdo preferují intimitu a kvalitu nad kvantitou\n\nPodívejte se na <a href="/cs/sluzby">naše služby</a> a zjistěte, co vše GFE zahrnuje.'
      }
    ],
    howItWorks: [
      { step: '1. Vyberte GFE společnici', text: 'Podívejte se na profily dívek s označením GFE.' },
      { step: '2. Popište svou představu', text: 'Řekněte nám, co si představujete – romantickou večeři, večer v hotelu…' },
      { step: '3. Naplánujeme to', text: 'Připravíme vše pro dokonalý GFE zážitek.' },
      { step: '4. Ponořte se', text: 'Užijte si pravý girlfriend experience – polibky, vášeň, blízkost.' }
    ],
    faq: [
      { question: 'Co přesně zahrnuje GFE?', answer: 'GFE typicky zahrnuje francouzské polibky, objímání, mazlení, společnou sprchu, romantickou atmosféru a sex s důrazem na intimitu. Konkrétní služby závisí na domluvě s dívkou.' },
      { question: 'Je GFE dražší než klasický escort?', answer: 'GFE bývá mírně dražší, protože dívky investují víc energie do vytvoření autentického zážitku. Doporučujeme delší setkání (2+ hodiny) pro plné využití GFE potenciálu.' },
      { question: 'Která dívka nabízí GFE?', answer: 'GFE nabízí vybrané společnice, které to baví a mají pro to osobnostní předpoklady. Na jejich profilech najdete značku GFE nebo kontaktujte naši recepci.' }
    ],
    internalLinks: [
      { text: 'GFE dívky', href: '/cs/divky' },
      { text: 'romantické služby', href: '/cs/sluzby' },
      { text: 'ceník GFE', href: '/cs/cenik' }
    ]
  },

  {
    slug: 'privat-praha',
    locale: 'cs',
    title: 'Privát Praha | Diskrétní Privátní Setkání | LovelyGirls',
    metaDescription: 'Privát Praha pro diskrétní setkání s krásnými dívkami. Privátní klub Praha v centru města. Čisté prostory, klimatizace, sprcha. Diskrétní setkání Praha 24/7.',
    h1: 'Privát Praha – Diskrétní Setkání v Centru',
    leadText: 'Hledáte privát v Praze pro diskrétní setkání? LovelyGirls provozuje privátní prostory v centru Prahy, kde se můžete setkat s našimi krásnými dívkami v pohodlí a soukromí. Žádné zvědavé pohledy, žádný stres – jen vy a vaše vybraná společnice v příjemném prostředí.',
    whyChooseUs: [
      'Privát Praha v centru města – snadná dostupnost MHD i autem, diskrétní vchod.',
      'Čisté a vybavené prostory – klimatizace, sprcha, čerstvé povlečení, nápoje.',
      'Absolutní diskrétnost – privátní klub Praha bez cedulí a výloh, nenápadný vstup.',
      'Diskrétní setkání Praha 24/7 – otevřeno nonstop, přijďte kdykoli.'
    ],
    girlsHeading: 'Dívky dostupné na privátu',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Privátní klub Praha – co vás čeká?',
        text: 'Náš privát Praha je diskrétní prostor navržený pro váš komfort. Při příchodu vás nikdo neuvidí – vstup je nenápadný a bez označení. Uvnitř najdete čisté, klimatizované pokoje s veškerým vybavením.\n\nVyberete si <a href="/cs/divky">dívku</a> předem online nebo na místě. Recepce vás uvede, nabídne nápoj a zajistí, aby bylo vše podle vašich představ. Privátní klub Praha je ideální pro ty, kdo nechtějí řešit logistiku outcall.'
      },
      {
        heading: 'Diskrétní setkání v Praze bez starostí',
        text: 'Výhodou privátu oproti hotelu je naprostá jednoduchost – nemusíte nikam cestovat na druhý konec města, nemusíte řešit hotelovou recepci a nemusíte uklízet svůj byt. Prostě přijdete, užijete si a odejdete.\n\nNabízíme různé typy pokojů pro různé příležitosti. Ceny najdete v <a href="/cs/cenik">ceníku</a>. K dispozici je i rozšířená nabídka <a href="/cs/sluzby">služeb</a> včetně masáží a speciálních přání.'
      }
    ],
    howItWorks: [
      { step: '1. Vyberte si dívku', text: 'Online na našem webu nebo po příchodu na privát.' },
      { step: '2. Přijďte na privát', text: 'Adresu obdržíte po kontaktování recepce.' },
      { step: '3. Přivítání', text: 'Recepce vás uvede, nabídne nápoj a představí dívku.' },
      { step: '4. Soukromí', text: 'Užijte si čas s vaší společnicí v plném soukromí.' }
    ],
    faq: [
      { question: 'Kde se nachází váš privát?', answer: 'Privát se nachází v centru Prahy, v docházkové vzdálenosti od metra. Přesnou adresu sdělujeme po kontaktování – je to z důvodu diskrétnosti.' },
      { question: 'Musím se objednávat předem?', answer: 'Doporučujeme předchozí rezervaci pro zajištění dostupnosti vaší preferované dívky. Nicméně je možné přijít i bez objednávky – záleží na aktuální obsazenosti.' },
      { question: 'Co vše je na privátu k dispozici?', answer: 'Klimatizovaný pokoj, čisté povlečení, sprcha, ručníky, nápoje (voda, džus), ochranné pomůcky a masážní oleje.' }
    ],
    internalLinks: [
      { text: 'dostupné dívky', href: '/cs/divky' },
      { text: 'nabídka služeb', href: '/cs/sluzby' },
      { text: 'ceník', href: '/cs/cenik' }
    ]
  },

  {
    slug: 'duo-escort-praha',
    locale: 'cs',
    title: 'Duo Escort Praha | Dvě Holky | Threesome Praha | LovelyGirls',
    metaDescription: 'Duo escort Praha – dvě krásné holky najednou. Threesome Praha s ověřenými dívkami. Splňte si fantazii o dvou holkách. Rezervace přes WhatsApp 24/7.',
    h1: 'Duo Escort Praha – Dvě Holky, Dvojnásobný Požitek',
    leadText: 'Vždycky jste snili o dvou krásných holkách najednou? S duo escort Praha se vám tento sen splní. Nabízíme threesome Praha s ověřenými dívkami, které spolu skvěle ladí a jsou připraveny vám poskytnout nezapomenutelný zážitek. Dvě holky Praha pro ty, kteří chtějí víc.',
    whyChooseUs: [
      'Duo escort Praha – pečlivě sestavené páry dívek, které se vzájemně doplňují.',
      'Threesome Praha s reálnou chemií – naše dívky spolu spolupracují pravidelně a baví je to.',
      'Dvě holky Praha za zvýhodněnou cenu – duo balíček vychází výhodněji než dvě samostatná setkání.',
      'Varietní výběr – blondýnka + brunetka, dvě zrzky, česká + exotická… vyberte si kombinaci.'
    ],
    girlsHeading: 'Dívky pro duo setkání',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Threesome Praha – jak to probíhá?',
        text: 'Duo escort Praha není jen o sexu ve třech – je to pečlivě orchestrovaný zážitek. Při objednávce vám pomůžeme vybrat ideální dvojici z našich <a href="/cs/divky">dívek</a>. Obě dívky se znají, mají mezi sebou chemii a vědí, jak spolu pracovat.\n\nSetkání může zahrnovat:\n• Lesbian show – dívky se navzájem předvedou\n• Aktivní threesome – obě dívky se věnují vám\n• Kombinace – mix vzájemné interakce a pozornosti na vás\n\nKonkrétní průběh záleží na vašich přáních a nabídce dívek.'
      },
      {
        heading: 'Dvě holky Praha – pro koho je to ideální?',
        text: 'Duo escort Praha je populární u mužů, kteří chtějí zažít něco výjimečného – ať už jako narozeninový dárek, oslavu nebo prostě proto, že si to zaslouží. Doporučujeme minimálně 2hodinové setkání, aby měl zážitek čas se rozvinout.\n\nCeny duo setkání najdete v <a href="/cs/cenik">ceníku</a>. Nabízíme i speciální <a href="/cs/sluzby">služby</a> pro duo, včetně roleplay a tematických scénářů.'
      }
    ],
    howItWorks: [
      { step: '1. Řekněte nám svou představu', text: 'Popište ideální dvojici – typ dívek, služby, délku setkání.' },
      { step: '2. Sestavíme duo', text: 'Navrhneme dvojici dívek, které se navzájem doplňují.' },
      { step: '3. Potvrzení', text: 'Po schválení vaší volby potvrdíme čas a místo.' },
      { step: '4. Dvojnásobný požitek', text: 'Dvě krásné holky se budou věnovat jen vám.' }
    ],
    faq: [
      { question: 'Kolik stojí duo escort Praha?', answer: 'Duo setkání začíná od 6 000 Kč za hodinu (obě dívky). Je to výrazně výhodnější než objednávat dvě dívky samostatně. Přesné ceny závisí na vybraných dívkách a službách.' },
      { question: 'Mohu si sám vybrat obě dívky?', answer: 'Ano, můžete. Doporučujeme ale nechat si poradit od naší recepce, která ví, které dvojice spolu nejlépe fungují.' },
      { question: 'Nabízíte i duo s mužem (MFM)?', answer: 'Aktuálně nabízíme primárně FMF kombinace. Pro speciální požadavky nás kontaktujte individuálně.' }
    ],
    internalLinks: [
      { text: 'naše dívky', href: '/cs/divky' },
      { text: 'duo služby', href: '/cs/sluzby' },
      { text: 'ceník duo', href: '/cs/cenik' }
    ]
  },

  {
    slug: 'nonstop-escort-praha',
    locale: 'cs',
    title: 'Nonstop Escort Praha | Noční Escort 24/7 | LovelyGirls',
    metaDescription: 'Nonstop escort Praha – k dispozici 24 hodin denně, 7 dní v týdnu. Noční escort Praha i v pozdních hodinách. Escort 24/7 Praha s rychlou rezervací.',
    h1: 'Nonstop Escort Praha – K Dispozici 24/7',
    leadText: 'Nespíte a toužíte po společnosti? Náš nonstop escort Praha je tu pro vás 24 hodin denně, 7 dní v týdnu. Ať je půlnoc, 3 ráno nebo nedělní odpoledne – naše noční escort Praha služby jsou vždy dostupné. Stačí napsat a za chvíli máte krásnou společnici.',
    whyChooseUs: [
      'Nonstop escort Praha – otevřeno 24/7, 365 dní v roce, i o svátcích.',
      'Noční escort Praha – specializujeme se na pozdní hodiny, kdy ostatní spí.',
      'Escort 24/7 Praha s rychlou odezvou – i ve 3 ráno odpovídáme do 5 minut.',
      'Vždy dostupné dívky – rotační systém směn zajišťuje stálou nabídku.'
    ],
    girlsHeading: 'Dívky dostupné právě teď',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Noční escort Praha – když ostatní spí',
        text: 'Praha nikdy nespí a ani my ne. Naše nonstop escort Praha služby jsou oblíbené zejména u nočních ptáků, podnikatelů po pozdních meetingech a turistů, kteří si chtějí užít pražský noční život naplno.\n\nV naší nabídce <a href="/cs/divky">dívek</a> vždy najdete několik společnic, které jsou právě k dispozici – ať je jakákoli hodina. Noční směny mají naše nejzkušenější dívky, které vědí, jak zpříjemnit pozdní hodiny.'
      },
      {
        heading: 'Escort 24/7 Praha bez čekání',
        text: 'Jednou z hlavních výhod nonstop escort Praha je rychlost. Chápeme, že pozdě v noci nechcete čekat hodiny. Proto je naše průměrná doba od objednávky po setkání jen 20–40 minut.\n\nNabízíme jak incall (návštěvu na privátu), tak outcall (dívka přijede k vám). Kompletní <a href="/cs/sluzby">seznam služeb</a> je dostupný i v nočních hodinách. <a href="/cs/cenik">Ceník</a> je stejný ve dne i v noci – žádné noční příplatky.'
      }
    ],
    howItWorks: [
      { step: '1. Napište kdykoli', text: 'WhatsApp a Telegram jsou aktivní 24/7, odpovídáme okamžitě.' },
      { step: '2. Zjistíme dostupnost', text: 'Ověříme, které dívky jsou právě k dispozici.' },
      { step: '3. Rychlá domluva', text: 'Čas, místo, služby – vše vyřídíme za pár minut.' },
      { step: '4. Setkání', text: 'I ve 3 ráno se k vám dostane krásná společnice.' }
    ],
    faq: [
      { question: 'Opravdu jste k dispozici i ve 3 ráno?', answer: 'Ano, naše nonstop escort Praha funguje skutečně 24/7. Recepce reaguje do 5 minut a dívky jsou na směnách i v pozdních nočních hodinách.' },
      { question: 'Jsou noční ceny vyšší?', answer: 'Ne, náš ceník je stejný ve dne i v noci. Žádné noční příplatky. Jediný příplatek může být za vzdálenější outcall.' },
      { question: 'Kolik dívek je v noci k dispozici?', answer: 'Obvykle 2–4 dívky v závislosti na dni v týdnu. O víkendech bývá nabídka širší. Aktuální dostupnost zjistíte po kontaktování recepce.' }
    ],
    internalLinks: [
      { text: 'dostupné dívky', href: '/cs/divky' },
      { text: 'služby', href: '/cs/sluzby' },
      { text: 'ceník', href: '/cs/cenik' }
    ]
  },

  // =============================================
  // ENGLISH LANDING PAGES
  // =============================================
  {
    slug: 'escort-prague',
    locale: 'en',
    title: 'Escort Prague | Best Prague Escort Agency | LovelyGirls',
    metaDescription: 'Looking for escort in Prague? LovelyGirls is a premium Prague escort agency with verified girls. Discreet meetings, fast booking via WhatsApp. Escort service Prague 24/7.',
    h1: 'Escort Prague – Premium Escort Agency',
    leadText: 'Welcome to LovelyGirls, Prague\'s most trusted escort agency. Whether you\'re visiting the Czech capital for business or pleasure, our escort service Prague offers verified companions who combine beauty, intelligence and genuine warmth. Fast booking via WhatsApp, complete discretion, and an unforgettable experience guaranteed.',
    whyChooseUs: [
      'Verified profiles – every girl passes a personal interview and photo verification, so you know exactly who you\'re meeting.',
      'Premium Prague escort agency – operating since years in the heart of Prague, trusted by hundreds of satisfied clients.',
      'Multilingual companions – our girls speak English, German, Russian and more, making communication effortless.',
      'Available 24/7 – whether it\'s noon or midnight, our reception responds within 5 minutes.'
    ],
    girlsHeading: 'Our Escort Girls in Prague',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Why Choose Our Escort Service in Prague?',
        text: 'Prague attracts millions of visitors every year, and many of them are looking for quality companionship. Unfortunately, the market is full of scams, fake photos and unreliable agencies. That\'s where LovelyGirls stands apart.\n\nOur <a href="/en/divky">girls</a> are real, verified and professional. Every profile features authentic photos, detailed descriptions and honest information about available services. When you book through us, you get exactly what you see – no surprises, no disappointments.\n\nCheck our <a href="/en/cenik">pricing page</a> for transparent rates with no hidden fees. We believe in honesty and quality above all.'
      },
      {
        heading: 'Prague Escort for Tourists and Business Travelers',
        text: 'Visiting Prague for the first time? Our companions can be your perfect guide to the city\'s hidden gems – from cozy wine bars in Vinohrady to rooftop restaurants overlooking the Castle. Or perhaps you prefer a quiet evening in your hotel room with a beautiful woman by your side.\n\nWhatever your preference, our <a href="/en/sluzby">services</a> cover everything from dinner dates and social events to intimate private encounters. Book your Prague escort experience today and discover why our clients keep coming back.'
      }
    ],
    howItWorks: [
      { step: '1. Browse profiles', text: 'Explore our girls\' photos, stats and services on the website.' },
      { step: '2. Contact us', text: 'Send us a message via WhatsApp, Telegram or give us a call.' },
      { step: '3. Confirmation', text: 'We confirm availability and arrange time and location within minutes.' },
      { step: '4. Enjoy', text: 'Meet your chosen companion and enjoy an unforgettable time in Prague.' }
    ],
    faq: [
      { question: 'How much does escort in Prague cost?', answer: 'Prices start from approximately €120 per hour depending on the girl and services. Check our pricing page for detailed rates. All prices are transparent with no hidden charges.' },
      { question: 'Are the photos real?', answer: 'Yes, 100%. Every girl undergoes photo verification. What you see on the profile is what you get in person. We take authenticity very seriously.' },
      { question: 'Do your girls speak English?', answer: 'Yes, all our girls speak at least basic English. Many are fluent in English, German and Russian. Language is never a barrier.' },
      { question: 'Can I book an outcall to my hotel?', answer: 'Absolutely. Our girls regularly visit hotels across Prague – from Old Town to the airport area. Discreet arrival guaranteed.' }
    ],
    internalLinks: [
      { text: 'all girls', href: '/en/divky' },
      { text: 'our services', href: '/en/sluzby' },
      { text: 'pricing', href: '/en/cenik' },
      { text: 'FAQ', href: '/en/faq' }
    ]
  },

  {
    slug: 'erotic-massage-prague',
    locale: 'en',
    title: 'Erotic Massage Prague | Sensual & Tantric Massage | LovelyGirls',
    metaDescription: 'Erotic massage Prague by beautiful masseuses. Sensual massage Prague, tantric massage, nuru and body-to-body. Professional service, discreet setting. Book 24/7.',
    h1: 'Erotic Massage Prague – Sensual & Tantric',
    leadText: 'Discover the art of sensual touch with our erotic massage Prague services. Our skilled masseuses offer tantric massage, nuru massage, body-to-body and classic sensual massage in a private, relaxing environment. Release your tension, awaken your senses and experience pleasure like never before.',
    whyChooseUs: [
      'Erotic massage Prague by trained masseuses – expert hands, aromatic oils, sensual atmosphere.',
      'Tantric massage Prague – a deep, spiritual experience connecting body and mind.',
      'Sensual massage with happy ending – ultimate relaxation with a satisfying conclusion.',
      'Private, clean rooms – air-conditioned, with shower and all amenities for your comfort.'
    ],
    girlsHeading: 'Our Masseuses in Prague',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Types of Erotic Massage We Offer',
        text: 'At LovelyGirls, we offer several types of erotic massage to suit your preferences:\n\n<strong>Tantric Massage Prague</strong> – an ancient practice that awakens your sexual energy through gentle, intentional touch. Our masseuses are trained in traditional tantric techniques.\n\n<strong>Nuru Massage</strong> – a Japanese full-body massage using special nuru gel. Intense skin-on-skin contact for maximum sensation.\n\n<strong>Body-to-Body Massage</strong> – the masseuse uses her entire body to massage yours. An incredibly sensual experience.\n\n<strong>Sensual Massage with Happy Ending</strong> – classic relaxation massage with a pleasurable conclusion.\n\nExplore all our <a href="/en/sluzby">services</a> for the full menu.'
      },
      {
        heading: 'Your Erotic Massage Experience in Prague',
        text: 'Unlike anonymous massage parlors, we offer a personal touch. You choose your masseuse from our <a href="/en/divky">gallery of girls</a>, book your appointment and enjoy. No surprises, no hidden fees – everything is transparent.\n\nMany of our clients combine massage with additional services for the ultimate experience. Check our <a href="/en/cenik">pricing</a> for package deals.'
      }
    ],
    howItWorks: [
      { step: '1. Choose your masseuse', text: 'Browse profiles and select the girl who appeals to you.' },
      { step: '2. Select massage type', text: 'Tantric, nuru, body-to-body or classic sensual massage.' },
      { step: '3. Book your session', text: 'Contact us via WhatsApp or Telegram to arrange your appointment.' },
      { step: '4. Relax & enjoy', text: 'Arrive, unwind and let expert hands take care of you.' }
    ],
    faq: [
      { question: 'How long is an erotic massage session?', answer: 'Standard sessions are 60 minutes. We also offer 30-minute express and 90-minute extended sessions. Longer sessions allow for deeper relaxation and more enjoyment.' },
      { question: 'What does "happy ending" mean?', answer: 'Happy ending refers to manual stimulation (hand job) at the end of the massage. It\'s a natural part of the erotic massage experience and is included in the price.' },
      { question: 'Do I need to bring anything?', answer: 'No, everything is provided – towels, shower, oils, refreshments. Just bring yourself and an open mind.' },
      { question: 'Can I combine massage with other services?', answer: 'Yes, many clients combine massage with classic sex, oral or GFE. Availability depends on the masseuse – check individual profiles for details.' }
    ],
    internalLinks: [
      { text: 'our masseuses', href: '/en/divky' },
      { text: 'all services', href: '/en/sluzby' },
      { text: 'massage pricing', href: '/en/cenik' }
    ]
  },

  {
    slug: 'vip-escort-prague',
    locale: 'en',
    title: 'VIP Escort Prague | Luxury & High-Class Companions | LovelyGirls',
    metaDescription: 'VIP escort Prague for discerning gentlemen. Luxury escort with high-class companions Prague. Premium service, absolute discretion. Available 24/7.',
    h1: 'VIP Escort Prague – Luxury & High-Class',
    leadText: 'For gentlemen who accept nothing but the best, our VIP escort Prague service delivers extraordinary companions who redefine luxury. These aren\'t just beautiful women – they\'re sophisticated, multilingual and socially adept. High-class companions Prague for business dinners, gala events, weekend getaways or intimate encounters at the highest level.',
    whyChooseUs: [
      'VIP escort Prague – handpicked models, beauty queens and women of exceptional charisma.',
      'Luxury escort tailored to you – from outfit selection to the evening\'s scenario, everything is customized.',
      'High-class companions Prague with language skills – English, German, Russian, French fluently.',
      'Absolute discretion – NDA available upon request, no digital footprint.'
    ],
    girlsHeading: 'VIP Companions in Prague',
    girlsFilter: { field: 'badge_type', value: 'top' },
    contentSections: [
      {
        heading: 'What Makes Our VIP Escort Prague Special?',
        text: 'VIP escort Prague is our premium tier, designed for clients who value quality above all. Our high-class companions are carefully selected women who combine natural beauty with impeccable social skills.\n\nThey are perfect for:\n• Prestigious social events and gala dinners\n• Business meetings where you need to impress\n• Luxury hotel weekends in Prague\n• Private encounters at the highest level\n\nBrowse our <a href="/en/divky">top girls</a> and choose your VIP companion for an unforgettable Prague experience.'
      },
      {
        heading: 'Luxury Escort Without Compromise',
        text: 'At LovelyGirls, we understand that luxury escort means more than just a pretty face. Our VIP companions undergo an extended selection process – we evaluate looks, intelligence, language skills, social etiquette and the ability to create genuine connections.\n\nVIP pricing is available on our <a href="/en/cenik">rates page</a>. We also offer packages for extended bookings and special occasions.'
      }
    ],
    howItWorks: [
      { step: '1. Contact VIP reception', text: 'Tell us your requirements – type of companion, occasion, duration.' },
      { step: '2. Curated selection', text: 'We present handpicked companions matching your criteria.' },
      { step: '3. Preparation', text: 'Your companion prepares according to your preferences – outfit, styling, fragrance.' },
      { step: '4. VIP experience', text: 'Enjoy a premium experience you\'ll remember for years.' }
    ],
    faq: [
      { question: 'How much does VIP escort in Prague cost?', answer: 'VIP services start from approximately €200 per hour. Pricing depends on the specific companion and booking duration. Weekend packages and special requests receive individual quotations.' },
      { question: 'What\'s the difference between regular and VIP escort?', answer: 'VIP companions are the crème de la crème – models, university-educated women, multilingual. They offer complete companionship at the highest level, including social events and travel.' },
      { question: 'Can I book a VIP companion for travel?', answer: 'Yes, our VIP companions are available for domestic and international travel. Contact our VIP reception for travel packages and arrangements.' }
    ],
    internalLinks: [
      { text: 'VIP girls', href: '/en/divky' },
      { text: 'premium services', href: '/en/sluzby' },
      { text: 'VIP pricing', href: '/en/cenik' }
    ]
  },

  {
    slug: 'hotel-escort-prague',
    locale: 'en',
    title: 'Hotel Escort Prague | Outcall to Your Hotel | LovelyGirls',
    metaDescription: 'Hotel escort Prague – a beautiful companion comes directly to your hotel room. Outcall Prague with discreet arrival. Prague hotel companions available 24/7.',
    h1: 'Hotel Escort Prague – Delivered to Your Door',
    leadText: 'Staying at a hotel in Prague and looking for company? Our hotel escort Prague service brings a stunning companion directly to your room. Discreet arrival, no awkward encounters in the lobby – just a beautiful woman knocking on your door, ready to make your evening unforgettable. Outcall Prague is our specialty.',
    whyChooseUs: [
      'Hotel escort Prague – your companion arrives at any hotel in Prague within 30–60 minutes.',
      'Outcall Prague with experience – our girls know how to navigate hotel lobbies, elevators and reception areas discreetly.',
      'Prague hotel companions 24/7 – late night, early morning, weekend – we\'re always available.',
      'All major hotels covered – from Old Town boutique hotels to airport Hilton, we come to you.'
    ],
    girlsHeading: 'Girls Available for Hotel Visits',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'How Hotel Escort Prague Works',
        text: 'Booking a hotel escort in Prague is simple. Browse our <a href="/en/divky">gallery of girls</a>, choose your companion, and tell us your hotel name and room number. Your companion will prepare herself beautifully and arrive at your door within 30–60 minutes.\n\nOur girls are experienced with hotel visits across Prague. They dress elegantly, arrive discreetly and know exactly how to behave in a hotel setting. To the outside world, she\'s simply a friend visiting your room.'
      },
      {
        heading: 'Outcall Prague – Any Location, Any Time',
        text: 'While hotels are our most popular outcall destination, we also visit private apartments, Airbnbs and holiday rentals across Prague. Transport costs vary by distance from the city center.\n\nPrefer to come to us instead? We also offer incall sessions in our private, comfortable premises. See our full <a href="/en/sluzby">services</a> and <a href="/en/cenik">pricing</a> for all options.'
      }
    ],
    howItWorks: [
      { step: '1. Choose your companion', text: 'Browse profiles and select your ideal girl.' },
      { step: '2. Share your location', text: 'Tell us your hotel name, address and room number.' },
      { step: '3. She prepares', text: 'Your companion gets ready and heads to your hotel.' },
      { step: '4. Discreet arrival', text: 'She arrives at your door – elegant, beautiful and ready.' }
    ],
    faq: [
      { question: 'How much extra does hotel outcall cost?', answer: 'A small transport fee of €10–20 is added to the standard rate, depending on hotel location. Central Prague hotels have minimal transport costs.' },
      { question: 'Will the hotel staff know?', answer: 'Our girls are experienced at being discreet in hotels. They dress elegantly and behave like a regular guest. In most Prague hotels, visitors can walk in freely.' },
      { question: 'How quickly can she arrive?', answer: 'In central Prague, typically 20–40 minutes. For hotels outside the center, 40–60 minutes. With advance booking, we can arrange exact timing.' },
      { question: 'Which hotels do you cover?', answer: 'All hotels in Prague and surrounding areas. We regularly visit hotels in Prague 1, 2, 3, 4, 5, 6, 7, 8 and near the airport.' }
    ],
    internalLinks: [
      { text: 'available girls', href: '/en/divky' },
      { text: 'services', href: '/en/sluzby' },
      { text: 'pricing', href: '/en/cenik' }
    ]
  },

  // =============================================
  // GERMAN LANDING PAGES
  // =============================================
  {
    slug: 'escort-prag',
    locale: 'de',
    title: 'Escort Prag | Premium Escort Service & Begleitservice | LovelyGirls',
    metaDescription: 'Escort Prag – Premium Escort Service mit verifizierten Damen. Begleitservice Prag für anspruchsvolle Herren. Diskrete Treffen, schnelle Buchung via WhatsApp.',
    h1: 'Escort Prag – Premium Begleitservice',
    leadText: 'Willkommen bei LovelyGirls, Ihrem vertrauenswürdigen Escort Service in Prag. Ob Sie geschäftlich in der tschechischen Hauptstadt sind oder Prag als Tourist erkunden – unser Begleitservice Prag bietet verifizierte Begleiterinnen, die Schönheit, Intelligenz und echte Herzlichkeit vereinen. Schnelle Buchung, absolute Diskretion und ein unvergessliches Erlebnis.',
    whyChooseUs: [
      'Verifizierte Profile – jede Dame durchläuft ein persönliches Interview und eine Fotoverifizierung.',
      'Premium Escort Service Prag – seit Jahren im Herzen Prags tätig, geschätzt von hunderten zufriedener Kunden.',
      'Mehrsprachige Begleiterinnen – unsere Damen sprechen Deutsch, Englisch, Russisch und mehr.',
      'Verfügbar rund um die Uhr – ob mittags oder mitternachts, unsere Rezeption antwortet innerhalb von 5 Minuten.'
    ],
    girlsHeading: 'Unsere Escort-Damen in Prag',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Warum unseren Escort Service in Prag wählen?',
        text: 'Prag zieht jährlich Millionen von Besuchern an, und viele suchen nach hochwertiger Begleitung. Leider ist der Markt voller Betrüger, gefälschter Fotos und unzuverlässiger Agenturen. Hier hebt sich LovelyGirls deutlich ab.\n\nUnsere <a href="/de/divky">Damen</a> sind echt, verifiziert und professionell. Jedes Profil zeigt authentische Fotos, detaillierte Beschreibungen und ehrliche Informationen über verfügbare Services. Wenn Sie bei uns buchen, bekommen Sie genau das, was Sie sehen.\n\nSchauen Sie sich unsere <a href="/de/cenik">Preisliste</a> an – transparente Preise ohne versteckte Gebühren.'
      },
      {
        heading: 'Begleitservice Prag für Geschäftsreisende und Touristen',
        text: 'Als deutschsprachiger Besucher in Prag möchten Sie sich verstanden fühlen. Unsere Begleiterinnen sprechen fließend Deutsch und kennen die besten Restaurants, Bars und Hotels der Stadt.\n\nUnser <a href="/de/sluzby">Serviceangebot</a> umfasst alles – von Dinner-Dates und gesellschaftlichen Events bis hin zu intimen privaten Begegnungen. Buchen Sie Ihr Escort-Erlebnis in Prag und entdecken Sie, warum unsere Kunden immer wieder kommen.'
      }
    ],
    howItWorks: [
      { step: '1. Profile durchsuchen', text: 'Erkunden Sie Fotos, Eigenschaften und Services unserer Damen.' },
      { step: '2. Kontaktieren Sie uns', text: 'Schreiben Sie uns via WhatsApp, Telegram oder rufen Sie an.' },
      { step: '3. Bestätigung', text: 'Wir bestätigen die Verfügbarkeit und vereinbaren Zeit und Ort.' },
      { step: '4. Genießen Sie', text: 'Treffen Sie Ihre gewählte Begleiterin und genießen Sie eine unvergessliche Zeit.' }
    ],
    faq: [
      { question: 'Wie viel kostet Escort in Prag?', answer: 'Die Preise beginnen bei ca. 120 € pro Stunde, abhängig von der Dame und den Services. Auf unserer Preisseite finden Sie detaillierte Tarife. Alle Preise sind transparent und ohne versteckte Kosten.' },
      { question: 'Sind die Fotos echt?', answer: 'Ja, zu 100%. Jede Dame durchläuft eine Fotoverifizierung. Was Sie im Profil sehen, ist das, was Sie persönlich treffen. Authentizität ist uns sehr wichtig.' },
      { question: 'Sprechen Ihre Damen Deutsch?', answer: 'Ja, viele unserer Damen sprechen fließend Deutsch. Bei der Buchung können Sie eine deutschsprachige Begleiterin bevorzugen.' },
      { question: 'Bieten Sie Outcall ins Hotel an?', answer: 'Selbstverständlich. Unsere Damen besuchen regelmäßig Hotels in ganz Prag – diskrete Ankunft garantiert.' }
    ],
    internalLinks: [
      { text: 'alle Damen', href: '/de/divky' },
      { text: 'unsere Services', href: '/de/sluzby' },
      { text: 'Preisliste', href: '/de/cenik' },
      { text: 'häufige Fragen', href: '/de/faq' }
    ]
  },

  {
    slug: 'erotische-massage-prag',
    locale: 'de',
    title: 'Erotische Massage Prag | Sinnliche & Tantra Massage | LovelyGirls',
    metaDescription: 'Erotische Massage Prag von wunderschönen Masseusen. Sinnliche Massage Prag, Tantra Massage, Nuru und Body-to-Body. Professioneller Service, diskrete Umgebung.',
    h1: 'Erotische Massage Prag – Sinnlich & Tantrisch',
    leadText: 'Entdecken Sie die Kunst der sinnlichen Berührung mit unserer erotischen Massage in Prag. Unsere geschulten Masseusen bieten Tantra Massage, Nuru Massage, Body-to-Body und klassische sinnliche Massage in einem privaten, entspannenden Ambiente. Lösen Sie Ihre Verspannungen, erwecken Sie Ihre Sinne und erleben Sie Genuss auf höchstem Niveau.',
    whyChooseUs: [
      'Erotische Massage Prag von ausgebildeten Masseusen – geschickte Hände, aromatische Öle, sinnliche Atmosphäre.',
      'Tantra Massage Prag – eine tiefe, spirituelle Erfahrung, die Körper und Geist verbindet.',
      'Sinnliche Massage mit Happy End – ultimative Entspannung mit befriedigendem Abschluss.',
      'Private, saubere Räume – klimatisiert, mit Dusche und allen Annehmlichkeiten für Ihren Komfort.'
    ],
    girlsHeading: 'Unsere Masseusen in Prag',
    girlsFilter: null,
    contentSections: [
      {
        heading: 'Arten erotischer Massage in Prag',
        text: 'Bei LovelyGirls bieten wir verschiedene Arten erotischer Massage an:\n\n<strong>Tantra Massage Prag</strong> – eine alte Praxis, die Ihre sexuelle Energie durch sanfte, achtsame Berührung erweckt. Unsere Masseusen sind in traditionellen tantrischen Techniken geschult.\n\n<strong>Nuru Massage</strong> – eine japanische Ganzkörpermassage mit speziellem Nuru-Gel. Intensiver Hautkontakt für maximale Empfindung.\n\n<strong>Body-to-Body Massage</strong> – die Masseuse verwendet ihren gesamten Körper, um Sie zu massieren. Ein unglaublich sinnliches Erlebnis.\n\n<strong>Sinnliche Massage mit Happy End</strong> – klassische Entspannungsmassage mit einem angenehmen Abschluss.\n\nEntdecken Sie alle unsere <a href="/de/sluzby">Services</a>.'
      },
      {
        heading: 'Ihr Massage-Erlebnis in Prag',
        text: 'Anders als in anonymen Massagesalons bieten wir einen persönlichen Service. Sie wählen Ihre Masseuse aus unserer <a href="/de/divky">Galerie</a>, buchen Ihren Termin und genießen. Keine Überraschungen, keine versteckten Gebühren.\n\nViele unserer Kunden kombinieren die Massage mit zusätzlichen Services. Auf unserer <a href="/de/cenik">Preisseite</a> finden Sie Paketangebote.'
      }
    ],
    howItWorks: [
      { step: '1. Masseuse wählen', text: 'Profile durchsuchen und die Dame auswählen, die Sie anspricht.' },
      { step: '2. Massageart wählen', text: 'Tantra, Nuru, Body-to-Body oder klassische sinnliche Massage.' },
      { step: '3. Termin buchen', text: 'Kontaktieren Sie uns via WhatsApp oder Telegram.' },
      { step: '4. Entspannen & genießen', text: 'Kommen Sie, entspannen Sie sich und lassen Sie sich verwöhnen.' }
    ],
    faq: [
      { question: 'Wie lange dauert eine erotische Massage?', answer: 'Standardsitzungen dauern 60 Minuten. Wir bieten auch 30-minütige Express- und 90-minütige Verlängerungssitzungen an. Längere Sitzungen ermöglichen tiefere Entspannung.' },
      { question: 'Was bedeutet "Happy End"?', answer: 'Happy End bezeichnet die manuelle Stimulation (Handarbeit) am Ende der Massage. Es ist ein natürlicher Teil der erotischen Massage und im Preis enthalten.' },
      { question: 'Muss ich etwas mitbringen?', answer: 'Nein, alles wird bereitgestellt – Handtücher, Dusche, Öle, Erfrischungen. Kommen Sie einfach und genießen Sie.' },
      { question: 'Kann ich die Massage mit anderen Services kombinieren?', answer: 'Ja, viele Kunden kombinieren Massage mit klassischem Sex, Oral oder GFE. Die Verfügbarkeit hängt von der Masseuse ab – Details finden Sie in den einzelnen Profilen.' }
    ],
    internalLinks: [
      { text: 'unsere Masseusen', href: '/de/divky' },
      { text: 'alle Services', href: '/de/sluzby' },
      { text: 'Preisliste', href: '/de/cenik' }
    ]
  },

  {
    slug: 'vip-escort-prag',
    locale: 'de',
    title: 'VIP Escort Prag | Luxus & High-Class Begleitung | LovelyGirls',
    metaDescription: 'VIP Escort Prag für anspruchsvolle Herren. Luxus Escort mit High-Class Begleiterinnen in Prag. Premium-Service, absolute Diskretion. Rund um die Uhr verfügbar.',
    h1: 'VIP Escort Prag – Luxus und Exklusivität',
    leadText: 'Für Herren, die nur das Beste akzeptieren, bietet unser VIP Escort Prag außergewöhnliche Begleiterinnen, die Luxus neu definieren. Dies sind nicht einfach nur schöne Frauen – sie sind gebildet, mehrsprachig und gesellschaftlich versiert. High-Class Begleitung Prag für Geschäftsessen, Gala-Events, Wochenendausflüge oder intime Begegnungen auf höchstem Niveau.',
    whyChooseUs: [
      'VIP Escort Prag – handverlesene Models, Schönheitsköniginnen und Frauen mit außergewöhnlichem Charisma.',
      'Luxus Escort nach Maß – von der Outfitwahl bis zum Ablauf des Abends wird alles individuell angepasst.',
      'High-Class Begleitung Prag mit Sprachkenntnissen – fließend Deutsch, Englisch, Russisch, Französisch.',
      'Absolute Diskretion – NDA auf Wunsch, kein digitaler Fußabdruck.'
    ],
    girlsHeading: 'VIP Begleiterinnen in Prag',
    girlsFilter: { field: 'badge_type', value: 'top' },
    contentSections: [
      {
        heading: 'Was macht unseren VIP Escort in Prag besonders?',
        text: 'VIP Escort Prag ist unsere Premium-Stufe, konzipiert für Kunden, die Qualität über alles stellen. Unsere High-Class Begleiterinnen sind sorgfältig ausgewählte Frauen, die natürliche Schönheit mit tadellosem gesellschaftlichem Auftreten verbinden.\n\nSie sind perfekt für:\n• Prestigeträchtige gesellschaftliche Events und Galadinner\n• Geschäftstreffen, bei denen Sie Eindruck machen möchten\n• Luxuriöse Hotelwochenenden in Prag\n• Private Begegnungen auf höchstem Niveau\n\nStöbern Sie in unserer <a href="/de/divky">Auswahl</a> und wählen Sie Ihre VIP-Begleiterin.'
      },
      {
        heading: 'Luxus Escort ohne Kompromisse',
        text: 'Bei LovelyGirls verstehen wir, dass Luxus Escort mehr bedeutet als nur ein hübsches Gesicht. Unsere VIP-Begleiterinnen durchlaufen einen erweiterten Auswahlprozess – wir bewerten Aussehen, Intelligenz, Sprachkenntnisse, gesellschaftliche Etikette und die Fähigkeit, echte Verbindungen zu schaffen.\n\nDie VIP-Preise finden Sie auf unserer <a href="/de/cenik">Preisseite</a>. Wir bieten auch Pakete für längere Buchungen und besondere Anlässe.'
      }
    ],
    howItWorks: [
      { step: '1. VIP-Rezeption kontaktieren', text: 'Teilen Sie uns Ihre Wünsche mit – Typ der Begleiterin, Anlass, Dauer.' },
      { step: '2. Kuratierte Auswahl', text: 'Wir präsentieren handverlesene Begleiterinnen, die Ihren Kriterien entsprechen.' },
      { step: '3. Vorbereitung', text: 'Ihre Begleiterin bereitet sich nach Ihren Wünschen vor – Outfit, Styling, Parfüm.' },
      { step: '4. VIP-Erlebnis', text: 'Genießen Sie ein Premium-Erlebnis, an das Sie sich noch lange erinnern werden.' }
    ],
    faq: [
      { question: 'Wie viel kostet VIP Escort in Prag?', answer: 'VIP-Services beginnen bei ca. 200 € pro Stunde. Die Preise hängen von der jeweiligen Begleiterin und der Buchungsdauer ab. Wochenendpakete und Sonderwünsche erhalten individuelle Angebote.' },
      { question: 'Was ist der Unterschied zwischen normalem und VIP Escort?', answer: 'VIP-Begleiterinnen sind die Crème de la Crème – Models, Akademikerinnen, mehrsprachig. Sie bieten komplette Begleitung auf höchstem Niveau, einschließlich gesellschaftlicher Events und Reisen.' },
      { question: 'Kann ich eine VIP-Begleiterin für Reisen buchen?', answer: 'Ja, unsere VIP-Begleiterinnen sind für In- und Auslandsreisen verfügbar. Kontaktieren Sie unsere VIP-Rezeption für Reisepakete.' }
    ],
    internalLinks: [
      { text: 'VIP Damen', href: '/de/divky' },
      { text: 'Premium-Services', href: '/de/sluzby' },
      { text: 'VIP-Preisliste', href: '/de/cenik' }
    ]
  }
];

// Helper to find a landing page by slug
export function getLandingPage(slug: string): LandingPage | undefined {
  return LANDING_PAGES.find(p => p.slug === slug);
}

// Helper to get all slugs for static generation
export function getAllLandingSlugs(): string[] {
  return LANDING_PAGES.map(p => p.slug);
}

// Helper to get landing pages by locale
export function getLandingPagesByLocale(locale: string): LandingPage[] {
  return LANDING_PAGES.filter(p => p.locale === locale);
}

// Map of slug to locale for URL routing
export function getLocaleForLandingSlug(slug: string): string | undefined {
  const page = LANDING_PAGES.find(p => p.slug === slug);
  return page?.locale;
}
