<?php
return [
    'timezone' => getenv('DHANI_TIMEZONE') ?: 'Asia/Kolkata',
    'site' => [
        'name' => getenv('DHANI_SITE_NAME') ?: 'Deshclub',
        'tenant_id' => (int) (getenv('DHANI_TENANT_ID') ?: 6006),
        'currency' => getenv('DHANI_CURRENCY') ?: 'INR',
    ],
    'db' => [
        'driver' => getenv('DHANI_DB_DRIVER') ?: 'auto',
        'sqlite_path' => getenv('DHANI_SQLITE_PATH') ?: __DIR__ . '/storage/dhaniwin.sqlite',
        'mysql' => [
            'host' => getenv('DHANI_DB_HOST') ?: 'localhost',
            'port' => getenv('DHANI_DB_PORT') ?: '3306',
            'database' => getenv('DHANI_DB_NAME') ?: 'dhandawintrushme_thaperfectprovider45',
            'username' => getenv('DHANI_DB_USER') ?: 'dhandawintrushme_thaperfectprovider45',
            'password' => getenv('DHANI_DB_PASS') ?: 'dhandawintrushme_thaperfectprovider45',
        ],
    ],
    'admin' => [
        'username' => getenv('DHANI_ADMIN_USER') ?: 'admin',
        'password' => getenv('DHANI_ADMIN_PASS') ?: 'admin123',
    ],
];

