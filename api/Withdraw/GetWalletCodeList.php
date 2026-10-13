<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'Withdraw/GetWalletCodeList';
$override = api_get_override($endpoint);
if ($override) {
    $decoded = api_json_decode_lenient((string) $override['content']);
    if ($decoded['ok']) {
        $payload = $decoded['data'];
        api_refresh_times($payload);
        api_emit($payload);
    }
}

$payload = [
        'data' => [
            [
                'code' => 'INR10119',
                'name' => 'PUNJAB NATIONAL BANK',
            ],
            [
                'code' => 'INR10157',
                'name' => 'TELANGANA STATE COOP APEX BANK',
            ],
            [
                'code' => 'INR10211',
                'name' => 'THE VARACHHA COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10075',
                'name' => 'INDUSTRIAL AND COMMERCIAL BANK OF CHINA
LIMITED',
            ],
            [
                'code' => 'INR10012',
                'name' => 'AU SMALL FINANCE BANK LIMITED',
            ],
            [
                'code' => 'INR10083',
                'name' => 'JANASEVA SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10214',
                'name' => 'THE WEST BENGAL STATE COOPERATIVE BANK',
            ],
            [
                'code' => 'INR10252',
                'name' => 'ESAF Small Finance Bank',
            ],
            [
                'code' => 'INR10021',
                'name' => 'BANK
OF INDIA',
            ],
            [
                'code' => 'INR10091',
                'name' => 'KARNATAKA GRAMIN BANK',
            ],
            [
                'code' => 'INR10086',
                'name' => 'JIO PAYMENTS BANK LIMITED',
            ],
            [
                'code' => 'INR10111',
                'name' => 'NORTH EAST SMALL FINANCE BANK LIMITED',
            ],
            [
                'code' => 'INR10169',
                'name' => 'THE DELHI STATE COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10261',
                'name' => 'Assam
Cooperative Apex Bank',
            ],
            [
                'code' => 'INR10024',
                'name' => 'BASSEIN CATHOLIC COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10062',
                'name' => 'HARYANA STATE COOPERATIVE BANK',
            ],
            [
                'code' => 'INR10094',
                'name' => 'KEB Hana Bank',
            ],
            [
                'code' => 'INR10114',
                'name' => 'Pavana Sahakari Bank LTD',
            ],
            [
                'code' => 'INR10099',
                'name' => 'Maharashtra
Gramin Bank',
            ],
            [
                'code' => 'INR10152',
                'name' => 'SUMITOMO MITSUI BANKING CORPORATION',
            ],
            [
                'code' => 'INR10070',
                'name' => 'IDUKKI DISTRICT CO OPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10185',
                'name' => 'The Malkapur Urban Co Operative Bank Ltd Malkapur',
            ],
            [
                'code' => 'INR10161',
                'name' => 'The
Ajara Urban Co op Bank Ltd Ajara',
            ],
            [
                'code' => 'INR10223',
                'name' => 'UTKARSH SMALL FINANCE BANK',
            ],
            [
                'code' => 'INR10007',
                'name' => 'AMBARNATH JAIHIND COOP BANK LTD AMBARNATH',
            ],
            [
                'code' => 'INR10037',
                'name' => 'CREDIT SUISEE AG',
            ],
            [
                'code' => 'INR10188',
                'name' => 'THE MUMBAI DISTRICT
CENTRAL COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10078',
                'name' => 'JALGAON JANATA SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10177',
                'name' => 'THE KANGRA COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10239',
                'name' => 'Tamilnad Mercantile Bank',
            ],
            [
                'code' => 'INR10164',
                'name' => 'THE
ANDHRA PRADESH STATE COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10226',
                'name' => 'VASAI VIKAS SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10045',
                'name' => 'DEUSTCHE BANK',
            ],
            [
                'code' => 'INR10123',
                'name' => 'RAJARSHI SHAHU SAHAKARI BANK LTD PUNE',
            ],
            [
                'code' => 'INR10193',
                'name' => 'THE
NAVNIRMAN CO-OPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10180',
                'name' => 'The Karnataka State Cooperative Apex Bank Ltd',
            ],
            [
                'code' => 'INR10048',
                'name' => 'DOHA BANK',
            ],
            [
                'code' => 'INR10139',
                'name' => 'Shivalik Small Finance Bank Limited',
            ],
            [
                'code' => 'INR10126',
                'name' => 'RAJKOT
NAGRIK SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10201',
                'name' => 'THE SATARA DISTRICT CENTRAL COOPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10231',
                'name' => 'Bandhan Bank',
            ],
            [
                'code' => 'INR10002',
                'name' => 'AHMEDABAD MERCANTILE COOPERATIVE BANK',
            ],
            [
                'code' => 'INR10032',
                'name' => 'CITI BANK',
            ],
            [
                'code' => 'INR10196',
                'name' => 'THE
ODISHA STATE COOPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10172',
                'name' => 'THE GUJARAT STATE COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10204',
                'name' => 'THE SURAT DISTRICT COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10234',
                'name' => 'IDFC First Bank',
            ],
            [
                'code' => 'INR10242',
                'name' => 'Punjab
& Sind Bank',
            ],
            [
                'code' => 'INR10209',
                'name' => 'THE UDAIPUR URBAN CO OPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10247',
                'name' => 'Janalakshmi Financial Services (Jana Small Finance',
            ],
            [
                'code' => 'INR10040',
                'name' => 'Darussalam Co operative Urban Bank Ltd',
            ],
            [
                'code' => 'INR10101',
                'name' => 'Mahesh
Sahakari Bank Ltd Pune',
            ],
            [
                'code' => 'INR10131',
                'name' => 'SANT SOPANKAKA SAHAKARI BANK LTD',
            ],
            [
                'code' => 'INR10104',
                'name' => 'MODEL COOPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10134',
                'name' => 'Satara Sahakari Bank Ltd',
            ],
            [
                'code' => 'INR10142',
                'name' => 'Shri Veershaiv Co Op Bank Ltd',
            ],
            [
                'code' => 'INR10109',
                'name' => 'NEW
INDIA COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10147',
                'name' => 'SOUTH INDIAN BANK',
            ],
            [
                'code' => 'INR10015',
                'name' => 'B N P PARIBAS',
            ],
            [
                'code' => 'INR10053',
                'name' => 'ESAF SMALL FINANCE BANK LIMITED',
            ],
            [
                'code' => 'INR10255',
                'name' => 'RBL Bank',
            ],
            [
                'code' => 'INR10018',
                'name' => 'BANK
OF BAHARAIN AND KUWAIT BSC',
            ],
            [
                'code' => 'INR10056',
                'name' => 'FINCARE SMALL FINANCE BANK LTD',
            ],
            [
                'code' => 'INR10089',
                'name' => 'KALUPUR COMMERCIAL COOPERATIVE BANK',
            ],
            [
                'code' => 'INR10258',
                'name' => 'City Union Bank',
            ],
            [
                'code' => 'INR10065',
                'name' => 'HSBC BANK',
            ],
            [
                'code' => 'INR10155',
                'name' => 'SUTEXCOOPERATIVE
BANK LIMITED',
            ],
            [
                'code' => 'INR10217',
                'name' => 'TJSB SAHAKARI BANK LTD',
            ],
            [
                'code' => 'INR10010',
                'name' => 'APNA SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10068',
                'name' => 'IDBI BANK',
            ],
            [
                'code' => 'INR10081',
                'name' => 'JANAKALYAN SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10158',
                'name' => 'TEXTILE
TRADERS CO OPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10250',
                'name' => 'Shivalik Small Finance Bank',
            ],
            [
                'code' => 'INR10027',
                'name' => 'BOMBAY MERCANTILE COOPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10097',
                'name' => 'KOTAK MAHINDRA BANK LIMITED',
            ],
            [
                'code' => 'INR10084',
                'name' => 'JANATA SAHAKARI
BANK LIMITED',
            ],
            [
                'code' => 'INR10117',
                'name' => 'PT BANK MAYBANK INDONESIA TBK',
            ],
            [
                'code' => 'INR10229',
                'name' => 'ZILA SAHAKRI BANK LIMITED GHAZIABAD',
            ],
            [
                'code' => 'INR10073',
                'name' => 'INDIANOVERSEAS BANK',
            ],
            [
                'code' => 'INR10060',
                'name' => 'G P PARSIK BANK',
            ],
            [
                'code' => 'INR10150',
                'name' => 'STATE
BANK OF INDIA',
            ],
            [
                'code' => 'INR10212',
                'name' => 'The Vijay Co Operative Bank Limited',
            ],
            [
                'code' => 'INR10076',
                'name' => 'INDUSTRIAL BANK OF KOREA',
            ],
            [
                'code' => 'INR10129',
                'name' => 'RESERVE BANK OF INDIA',
            ],
            [
                'code' => 'INR10167',
                'name' => 'THE BARAMATI SAHAKARI BANK LTD',
            ],
            [
                'code' => 'INR10221',
                'name' => 'UNION
BANK OF INDIA',
            ],
            [
                'code' => 'INR10005',
                'name' => 'AKOLA JANATA COMMERCIAL COOPERATIVE BANK',
            ],
            [
                'code' => 'INR10035',
                'name' => 'COASTAL LOCAL AREA BANK LTD',
            ],
            [
                'code' => 'INR10022',
                'name' => 'BANK OF MAHARASHTRA',
            ],
            [
                'code' => 'INR10092',
                'name' => 'KARNATAKA VIKAS GRAMEENA BANK',
            ],
            [
                'code' => 'INR10175',
                'name' => 'THE
KALYAN JANATA SAHAKARI BANK LTD.',
            ],
            [
                'code' => 'INR10112',
                'name' => 'NSDL Payments Bank Limited',
            ],
            [
                'code' => 'INR10224',
                'name' => 'UTTAR PRADESH COOPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10262',
                'name' => 'Odisha State Cooperative Bank',
            ],
            [
                'code' => 'INR10038',
                'name' => 'CSB BANK LIMITED',
            ],
            [
                'code' => 'INR10183',
                'name' => 'THE
KURMANCHAL NAGAR SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10121',
                'name' => 'RABOBANK INTERNATIONAL',
            ],
            [
                'code' => 'INR10191',
                'name' => 'THE NAINITAL BANK LIMITED',
            ],
            [
                'code' => 'INR10186',
                'name' => 'The Meghalaya Co-operative Apex Bank Ltd',
            ],
            [
                'code' => 'INR10124',
                'name' => 'RAJASTHAN
MARUDHARA GRAMIN BANK',
            ],
            [
                'code' => 'INR10207',
                'name' => 'THE THANE BHARAT SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10237',
                'name' => 'Kotak Mahindra Bank',
            ],
            [
                'code' => 'INR10162',
                'name' => 'THE AKOLA DISTRICT CENTRAL COOPERATIVE BANK',
            ],
            [
                'code' => 'INR10030',
                'name' => 'CENTRAL BANK
OF INDIA',
            ],
            [
                'code' => 'INR10194',
                'name' => 'THE NAWANAGAR COOPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10199',
                'name' => 'The Pusad Urban Cooperative Bank Ltd Pusad',
            ],
            [
                'code' => 'INR10043',
                'name' => 'DEOGIRI NAGARI SAHAKARI BANK LTD. AURANGABAD',
            ],
            [
                'code' => 'INR10170',
                'name' => 'THE
GADCHIROLI DISTRICT CENTRAL COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10245',
                'name' => 'Equitas Small Finance Bank',
            ],
            [
                'code' => 'INR10008',
                'name' => 'ANDHRA PRADESHGRAMEENA VIKAS BANK',
            ],
            [
                'code' => 'INR10059',
                'name' => 'FIRSTRAND BANK LIMITED',
            ],
            [
                'code' => 'INR10046',
                'name' => 'DHANALAKSHMI
BANK',
            ],
            [
                'code' => 'INR10107',
                'name' => 'NATIONAL BANK FOR AGRICULTURE AND RURAL DEVELOPMENT',
            ],
            [
                'code' => 'INR10137',
                'name' => 'SHIKSHAK SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10178',
                'name' => 'THE KARAD URBAN COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10248',
                'name' => 'Fincare
Small Finance Bank',
            ],
            [
                'code' => 'INR10202',
                'name' => 'THE SHAMRAO VITHAL COOPERATIVE BANK',
            ],
            [
                'code' => 'INR10232',
                'name' => 'DCB Bank',
            ],
            [
                'code' => 'INR10145',
                'name' => 'SOCIETE GENERALE',
            ],
            [
                'code' => 'INR10051',
                'name' => 'Emirates NBD Bank (P.J.S.C)',
            ],
            [
                'code' => 'INR10148',
                'name' => 'SREE
CHARAN SOUHARDHA CO OPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10240',
                'name' => 'Jammu & Kashmir Bank',
            ],
            [
                'code' => 'INR10054',
                'name' => 'EXPORT IMPORT BANK OF INDIA',
            ],
            [
                'code' => 'INR10102',
                'name' => 'MASHREQBANK PSC',
            ],
            [
                'code' => 'INR10132',
                'name' => 'Saraspur Nagrik Co operative Bank
Ltd Saraspur',
            ],
            [
                'code' => 'INR10013',
                'name' => 'AUSTRALIA AND NEW ZEALAND BANKING GROUP LIMITED',
            ],
            [
                'code' => 'INR10215',
                'name' => 'THE ZOROASTRIAN COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10140',
                'name' => 'Shree Kadi Nagarik Sahakari Bank Limited',
            ],
            [
                'code' => 'INR10253',
                'name' => 'Unity
Small Finance Bank',
            ],
            [
                'code' => 'INR10016',
                'name' => 'BANDHAN BANK LIMITED',
            ],
            [
                'code' => 'INR10087',
                'name' => 'JP MORGAN BANK',
            ],
            [
                'code' => 'INR10218',
                'name' => 'TUMKUR GRAIN MERCHANTS COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10256',
                'name' => 'Airtel Payments Bank',
            ],
            [
                'code' => 'INR10025',
                'name' => 'BHAGINI
NIVEDITA SAHAKARI BANK LTD PUNE',
            ],
            [
                'code' => 'INR10063',
                'name' => 'HDFC BANK',
            ],
            [
                'code' => 'INR10095',
                'name' => 'KERALA GRAMIN BANK',
            ],
            [
                'code' => 'INR10115',
                'name' => 'PAYTM PAYMENTS BANK LTD',
            ],
            [
                'code' => 'INR10153',
                'name' => 'SURAT NATIONAL COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10071',
                'name' => 'INDIA
POST PAYMENT BANK',
            ],
            [
                'code' => 'INR10028',
                'name' => 'CANARA BANK',
            ],
            [
                'code' => 'INR10066',
                'name' => 'Hutatma Sahakari Bank Ltd',
            ],
            [
                'code' => 'INR10118',
                'name' => 'PUNJAB AND SIND BANK',
            ],
            [
                'code' => 'INR10156',
                'name' => 'TAMILNAD MERCANTILE BANK LIMITED',
            ],
            [
                'code' => 'INR10210',
                'name' => 'THE
URBAN CO OPERATIVE BANK Ltd No ONE SEVEN FIVE EIGHT PERINTHALMANNA',
            ],
            [
                'code' => 'INR10074',
                'name' => 'INDUSIND BANK',
            ],
            [
                'code' => 'INR10189',
                'name' => 'THE MUNICIPAL COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10079',
                'name' => 'JAMMU AND KASHMIR BANK LIMITED',
            ],
            [
                'code' => 'INR10082',
                'name' => 'JANASEVA
SAHAKARI BANK BORIVLI LIMITED',
            ],
            [
                'code' => 'INR10165',
                'name' => 'The Banaskantha Mercantile Cooperative Bank Ltd',
            ],
            [
                'code' => 'INR10227',
                'name' => 'WOORI BANK',
            ],
            [
                'code' => 'INR10020',
                'name' => 'BANK OF CEYLON',
            ],
            [
                'code' => 'INR10090',
                'name' => 'KARNATAKA BANK LIMITED',
            ],
            [
                'code' => 'INR10110',
                'name' => 'NKGSB
COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10168',
                'name' => 'THE COSMOS CO OPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10260',
                'name' => 'Himachal Pradesh State Cooperative Bank',
            ],
            [
                'code' => 'INR10181',
                'name' => 'The Kerala State Co Operative Bank Ltd',
            ],
            [
                'code' => 'INR10049',
                'name' => 'DOMBIVLI
NAGARI SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10127',
                'name' => 'Rajnandgaon District Central Co-operative Bank Ltd',
            ],
            [
                'code' => 'INR10098',
                'name' => 'KOZHIKODE DISTRICT COOPERATIAVE BANK LTD',
            ],
            [
                'code' => 'INR10003',
                'name' => 'AHMEDNAGAR MERCHANTS CO-OP BANK LTD',
            ],
            [
                'code' => 'INR10033',
                'name' => 'CITIZEN
CREDIT COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10197',
                'name' => 'THE PANDHARPUR URBAN CO OP. BANK LTD. PANDHARPUR',
            ],
            [
                'code' => 'INR10184',
                'name' => 'The Malad Sahakari Bank Ltd',
            ],
            [
                'code' => 'INR10173',
                'name' => 'THE HASTI COOP BANK LTD',
            ],
            [
                'code' => 'INR10205',
                'name' => 'THE
SURATH PEOPLES COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10235',
                'name' => 'Indian Overseas Bank',
            ],
            [
                'code' => 'INR10160',
                'name' => 'THE AHMEDNAGAR DISTRICT CENTRAL CO-OPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10222',
                'name' => 'UNITED OVERSEAS BANK LIMITED',
            ],
            [
                'code' => 'INR10006',
                'name' => 'ALMORA
URBAN COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10036',
                'name' => 'CREDIT AGRICOLE CORPORATE AND INVESTMENT BANK CALYON BANK',
            ],
            [
                'code' => 'INR10041',
                'name' => 'DBS BANK INDIA LIMITED',
            ],
            [
                'code' => 'INR10176',
                'name' => 'THE KANGRA CENTRAL COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10238',
                'name' => 'Syndicate
Bank',
            ],
            [
                'code' => 'INR10044',
                'name' => 'DEPOSIT INSURANCE AND CREDIT GUARANTEE CORPORATION',
            ],
            [
                'code' => 'INR10105',
                'name' => 'MUFG BANK, LTD',
            ],
            [
                'code' => 'INR10135',
                'name' => 'SBER BANK',
            ],
            [
                'code' => 'INR10122',
                'name' => 'RAJARAMBAPU SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10192',
                'name' => 'THE
NASIK MERCHANTS COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10138',
                'name' => 'SHINHAN BANK',
            ],
            [
                'code' => 'INR10200',
                'name' => 'THE RAJASTHAN STATE COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10230',
                'name' => 'Andhra Bank',
            ],
            [
                'code' => 'INR10243',
                'name' => 'Suryoday Small Finance Bank',
            ],
            [
                'code' => 'INR10019',
                'name' => 'BANK
OF BARODA',
            ],
            [
                'code' => 'INR10057',
                'name' => 'FINO PAYMENTS BANK',
            ],
            [
                'code' => 'INR10208',
                'name' => 'THE THANE DISTRICT CENTRAL COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10259',
                'name' => 'Paytm Payments Bank',
            ],
            [
                'code' => 'INR10246',
                'name' => 'Ujjivan Small Finance Bank',
            ],
            [
                'code' => 'INR10100',
                'name' => 'MAHARASHTRA
STATE COOPERATIVE BANK',
            ],
            [
                'code' => 'INR10130',
                'name' => 'SAMARTH SAHAKARI BANK LTD',
            ],
            [
                'code' => 'INR10143',
                'name' => 'SIR M VISVESVARAYA CO OPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10069',
                'name' => 'IDFC FIRST BANK LTD',
            ],
            [
                'code' => 'INR10011',
                'name' => 'ARVIND SAHAKARI BANK LTD',
            ],
            [
                'code' => 'INR10108',
                'name' => 'NAV
JEEVAN CO OP BANK LTD',
            ],
            [
                'code' => 'INR10159',
                'name' => 'THE A.P. MAHESH COOPERATIVE URBAN BANK LIMITED',
            ],
            [
                'code' => 'INR10146',
                'name' => 'SOLAPUR JANATA SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10251',
                'name' => 'Capital Small Finance Bank',
            ],
            [
                'code' => 'INR10014',
                'name' => 'AXIS
BANK',
            ],
            [
                'code' => 'INR10052',
                'name' => 'EQUITAS SMALL FINANCE BANK LIMITED',
            ],
            [
                'code' => 'INR10085',
                'name' => 'JANATHA SEVA COOPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10254',
                'name' => 'NSDL Payments Bank',
            ],
            [
                'code' => 'INR10061',
                'name' => 'GS Mahanagar Co-operative Bank Limited, Mumbai',
            ],
            [
                'code' => 'INR10088',
                'name' => 'KALLAPPANNA
AWADE ICHALKARANJI JANATA SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10151',
                'name' => 'Suco Souharda Sahakari Bank Ltd',
            ],
            [
                'code' => 'INR10213',
                'name' => 'THE VISHWESHWAR SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10077',
                'name' => 'Irinjalakuda Town Co-Operative Bank Ltd',
            ],
            [
                'code' => 'INR10064',
                'name' => 'HIMACHAL
PRADESH STATE COOPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10154',
                'name' => 'SURYODAY SMALL FINANCE BANK LIMITED',
            ],
            [
                'code' => 'INR10216',
                'name' => 'THRISSUR DISTRICT CO-OPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10023',
                'name' => 'BARCLAYS BANK',
            ],
            [
                'code' => 'INR10093',
                'name' => 'KARUR VYSYA
BANK',
            ],
            [
                'code' => 'INR10080',
                'name' => 'JANA SMALL FINANCE BANK LTD',
            ],
            [
                'code' => 'INR10113',
                'name' => 'NUTAN NAGARIK SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10225',
                'name' => 'VASAI JANATA SAHAKARI BANK LTD',
            ],
            [
                'code' => 'INR10263',
                'name' => 'Nainital Bank',
            ],
            [
                'code' => 'INR10039',
                'name' => 'CTBC
BANK CO LTD',
            ],
            [
                'code' => 'INR10026',
                'name' => 'BHARAT COOPERATIVE BANK MUMBAI LIMITED',
            ],
            [
                'code' => 'INR10096',
                'name' => 'KOOKMIN BANK',
            ],
            [
                'code' => 'INR10116',
                'name' => 'PRIME COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10228',
                'name' => 'YES BANK',
            ],
            [
                'code' => 'INR10072',
                'name' => 'INDIAN
BANK',
            ],
            [
                'code' => 'INR10187',
                'name' => 'THE MEHSANA URBAN COOPERATIVE BANK',
            ],
            [
                'code' => 'INR10125',
                'name' => 'RAJGURUNAGAR SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10163',
                'name' => 'The Akola Urban Cooperative Bank Limited',
            ],
            [
                'code' => 'INR10001',
                'name' => 'ABHYUDAYA COOPERATIVE
BANK LIMITED',
            ],
            [
                'code' => 'INR10031',
                'name' => 'CHHATTISGARH RAJYA GRAMIN BANK',
            ],
            [
                'code' => 'INR10195',
                'name' => 'THE NILAMBUR CO OPERATIVE URBAN BANK LTD NILAMBUR',
            ],
            [
                'code' => 'INR10128',
                'name' => 'RBL BANK LIMITED',
            ],
            [
                'code' => 'INR10171',
                'name' => 'THE GREATER BOMBAY COOPERATIVE
BANK LIMITED',
            ],
            [
                'code' => 'INR10166',
                'name' => 'THE BANK OF NOVA SCOTIA',
            ],
            [
                'code' => 'INR10220',
                'name' => 'Ujjivan Small Finance Bank Limited',
            ],
            [
                'code' => 'INR10004',
                'name' => 'AIRTEL PAYMENTS BANK LIMITED',
            ],
            [
                'code' => 'INR10034',
                'name' => 'CITY UNION BANK LIMITED',
            ],
            [
                'code' => 'INR10042',
                'name' => 'DCB
BANK LIMITED',
            ],
            [
                'code' => 'INR10009',
                'name' => 'ANDHRA PRAGATHI GRAMEENA BANK',
            ],
            [
                'code' => 'INR10047',
                'name' => 'DMK JAOLI BANK',
            ],
            [
                'code' => 'INR10174',
                'name' => 'THE JALGAON PEOPELS COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10179',
                'name' => 'THE KARANATAKA STATE COOPERATIVE
APEX BANK LIMITED',
            ],
            [
                'code' => 'INR10249',
                'name' => 'North East Small Finance Bank',
            ],
            [
                'code' => 'INR10182',
                'name' => 'The Kolhapur Urban Co-op Bank Ltd',
            ],
            [
                'code' => 'INR10120',
                'name' => 'QATAR NATIONAL BANK SAQ',
            ],
            [
                'code' => 'INR10203',
                'name' => 'THE SINDHUDURG DISTRICT CENTRAL
COOP BANK LTD',
            ],
            [
                'code' => 'INR10233',
                'name' => 'ICICI Bank',
            ],
            [
                'code' => 'INR10190',
                'name' => 'The Muslim Co-operative Bank Ltd',
            ],
            [
                'code' => 'INR10206',
                'name' => 'THE TAMIL NADU STATE APEXCOOPERATIVE BANK',
            ],
            [
                'code' => 'INR10236',
                'name' => 'Karnataka Bank',
            ],
            [
                'code' => 'INR10149',
                'name' => 'STANDARD
CHARTERED BANK',
            ],
            [
                'code' => 'INR10241',
                'name' => 'Dhanlaxmi Bank',
            ],
            [
                'code' => 'INR10055',
                'name' => 'FEDERAL BANK',
            ],
            [
                'code' => 'INR10198',
                'name' => 'THE PUNJAB STATE COOPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10103',
                'name' => 'MIZUHO BANK LTD',
            ],
            [
                'code' => 'INR10133',
                'name' => 'SARASWAT
COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10244',
                'name' => 'AU Small Finance Bank',
            ],
            [
                'code' => 'INR10058',
                'name' => 'FIRST ABU DHABI BANK PJSC',
            ],
            [
                'code' => 'INR10106',
                'name' => 'NAGPUR NAGARIK SAHAKARI BANK LIMITED',
            ],
            [
                'code' => 'INR10136',
                'name' => 'SBM BANK INDIA LIMITED',
            ],
            [
                'code' => 'INR10141',
                'name' => 'SHRI
CHHATRAPATI RAJASHRI SHAHU URBAN COOPERATIVE BANK LIMITED',
            ],
            [
                'code' => 'INR10017',
                'name' => 'BANK OF AMERICA',
            ],
            [
                'code' => 'INR10219',
                'name' => 'UCO BANK',
            ],
            [
                'code' => 'INR10144',
                'name' => 'Smriti Nagrik Sahakari Bank Maryadit',
            ],
            [
                'code' => 'INR10257',
                'name' => 'India Post Payments
Bank',
            ],
            [
                'code' => 'INR10050',
                'name' => 'DURGAPUR STEEL PEOPLES CO-OPERATIVE BANK LTD',
            ],
            [
                'code' => 'INR10029',
                'name' => 'CAPITAL SMALL FINANCE BANK LIMITED',
            ],
            [
                'code' => 'INR10067',
                'name' => 'ICICI BANK LIMITED',
            ],
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780315604854,
    ];

api_refresh_times($payload);
api_emit($payload);
