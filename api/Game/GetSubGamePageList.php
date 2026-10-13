<?php
require_once dirname(__DIR__) . '/_bootstrap.php';

$endpoint = 'Game/GetSubGamePageList';
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
            'list' => [
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20136,
                    'gameCode' => '51',
                    'gameName' => 'Money Coming',
                    'img' => '/img/0/gamelogo/JILI/121856416-9549-51.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20008,
                    'gameCode' => '109',
                    'gameName' => 'Fortune
Gems',
                    'img' => '/img/0/gamelogo/JILI/121848285-9219-109.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20074,
                    'gameCode' => '224',
                    'gameName' => 'Go Rush',
                    'img' => '/img/0/gamelogo/JILI/121851773-9355-224.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20073,
                    'gameCode' => '223',
                    'gameName' => 'Fortune
Gems 2',
                    'img' => '/img/0/gamelogo/JILI/121851683-9353-223.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20078,
                    'gameCode' => '229',
                    'gameName' => 'Mines',
                    'img' => '/img/0/gamelogo/JILI/121851930-9361-229.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20083,
                    'gameCode' => '235',
                    'gameName' => 'Limbo',
                    'img' => '/img/0/gamelogo/JILI/121852184-9373-235.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20084,
                    'gameCode' => '236',
                    'gameName' => 'Wheel',
                    'img' => '/img/0/gamelogo/JILI/121852253-9375-236.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20064,
                    'gameCode' => '200',
                    'gameName' => 'Pappu',
                    'img' => '/img/0/gamelogo/JILI/121851174-9333-200.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20134,
                    'gameCode' => '49',
                    'gameName' => 'Super
Ace',
                    'img' => '/img/0/gamelogo/JILI/121856349-9543-49.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20099,
                    'gameCode' => '27',
                    'gameName' => 'SevenSevenSeven',
                    'img' => '/img/0/gamelogo/JILI/121852933-9405-27.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20108,
                    'gameCode' => '32',
                    'gameName' => 'Jackpot
Fishing',
                    'img' => '/img/0/gamelogo/JILI/121853598-9429-32.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20151,
                    'gameCode' => '82',
                    'gameName' => 'Happy Fishing',
                    'img' => '/img/0/gamelogo/JILI/121857714-9607-82.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20081,
                    'gameCode' => '232',
                    'gameName' => 'Tower',
                    'img' => '/img/0/gamelogo/JILI/121852143-9369-232.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20110,
                    'gameCode' => '35',
                    'gameName' => 'Crazy777',
                    'img' => '/img/0/gamelogo/JILI/121853779-9437-35.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20060,
                    'gameCode' => '197',
                    'gameName' => 'Color
Game',
                    'img' => '/img/0/gamelogo/JILI/121851045-9325-197.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20121,
                    'gameCode' => '42',
                    'gameName' => 'Dinosaur Tycoon',
                    'img' => '/img/0/gamelogo/JILI/121854880-9487-42.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20000,
                    'gameCode' => '1',
                    'gameName' => 'Royal
Fishing',
                    'img' => '/img/0/gamelogo/JILI/1.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20132,
                    'gameCode' => '47',
                    'gameName' => 'Charge Buffalo',
                    'img' => '/img/0/gamelogo/JILI/121856091-9533-47.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20147,
                    'gameCode' => '74',
                    'gameName' => 'Mega
Fishing',
                    'img' => '/img/0/gamelogo/JILI/121857498-9599-74.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20082,
                    'gameCode' => '233',
                    'gameName' => 'HIlo',
                    'img' => '/img/0/gamelogo/JILI/121852178-9371-233.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20063,
                    'gameCode' => '20',
                    'gameName' => 'Bombing
Fishing',
                    'img' => '/img/0/gamelogo/JILI/121851164-9331-20.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20128,
                    'gameCode' => '45',
                    'gameName' => 'Golden Bank',
                    'img' => '/img/0/gamelogo/JILI/121855568-9511-45.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20149,
                    'gameCode' => '77',
                    'gameName' => 'Boxing
King',
                    'img' => '/img/0/gamelogo/JILI/121857600-9603-77.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20146,
                    'gameCode' => '71',
                    'gameName' => 'Boom Legend',
                    'img' => '/img/0/gamelogo/JILI/121857493-9597-71.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20005,
                    'gameCode' => '103',
                    'gameName' => 'Golden
Empire',
                    'img' => '/img/0/gamelogo/JILI/121848170-9213-103.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20017,
                    'gameCode' => '119',
                    'gameName' => 'All-star Fishing',
                    'img' => '/img/0/gamelogo/JILI/121848745-9237-119.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20002,
                    'gameCode' => '100',
                    'gameName' => 'Super
Rich',
                    'img' => '/img/0/gamelogo/JILI/121847984-9211-100.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20025,
                    'gameCode' => '134',
                    'gameName' => 'Mega Ace',
                    'img' => '/img/0/gamelogo/JILI/121849182-9253-134.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20069,
                    'gameCode' => '212',
                    'gameName' => 'Dinosaur
Tycoon II',
                    'img' => '/img/0/gamelogo/JILI/121851517-9345-212.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
                [
                    'vendorCode' => 'JILI',
                    'gameId' => 20104,
                    'gameCode' => '300',
                    'gameName' => 'Fortune Gems 3',
                    'img' => '/img/0/gamelogo/JILI/121853358-9419-300.png',
                    'isPlatMaintenance' => false,
                    'isGameMaintenance' => false,
                ],
            ],
            'pageNo' => 1,
            'totalPage' => 8,
            'totalCount' => 225,
        ],
        'code' => 0,
        'msg' => 'Succeed',
        'msgCode' => 0,
        'serverTime' => 1780316654590,
    ];

api_refresh_times($payload);
api_emit($payload);
