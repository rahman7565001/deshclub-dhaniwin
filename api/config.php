<?php
return [
    'timezone' => getenv('SITE_TIMEZONE') ?: (getenv('DESHCLUB_TIMEZONE') ?: (getenv('DHANI_TIMEZONE') ?: 'Asia/Dhaka')),
    'site' => [
        'name' => getenv('SITE_NAME') ?: (getenv('DESHCLUB_SITE_NAME') ?: (getenv('DHANI_SITE_NAME') ?: 'Deshclub')),
        'tenant_id' => (int) (getenv('SITE_TENANT_ID') ?: (getenv('DESHCLUB_TENANT_ID') ?: (getenv('DHANI_TENANT_ID') ?: 6006))),
        'currency' => getenv('SITE_CURRENCY') ?: (getenv('DESHCLUB_CURRENCY') ?: (getenv('DHANI_CURRENCY') ?: 'BDT')),
    ],
    'db' => [
        // 'auto' uses SQLite out-of-the-box (zero configuration needed on any hosting)
        // If MySQL credentials are provided below, it connects to MySQL automatically.
        'driver' => getenv('DB_DRIVER') ?: (getenv('DESHCLUB_DB_DRIVER') ?: (getenv('DHANI_DB_DRIVER') ?: 'auto')),
        'sqlite_path' => getenv('SQLITE_PATH') ?: (getenv('DESHCLUB_SQLITE_PATH') ?: (getenv('DHANI_SQLITE_PATH') ?: (
            file_exists(__DIR__ . '/storage/deshclub.sqlite')
                ? __DIR__ . '/storage/deshclub.sqlite'
                : __DIR__ . '/storage/dhaniwin.sqlite'
        ))),
        'mysql' => [
            'host' => getenv('DB_HOST') ?: (getenv('DESHCLUB_DB_HOST') ?: (getenv('DHANI_DB_HOST') ?: 'localhost')),
            'port' => getenv('DB_PORT') ?: (getenv('DESHCLUB_DB_PORT') ?: (getenv('DHANI_DB_PORT') ?: '3306')),
            'database' => getenv('DB_NAME') ?: (getenv('DESHCLUB_DB_NAME') ?: (getenv('DHANI_DB_NAME') ?: '')),
            'username' => getenv('DB_USER') ?: (getenv('DESHCLUB_DB_USER') ?: (getenv('DHANI_DB_USER') ?: '')),
            'password' => getenv('DB_PASS') ?: (getenv('DESHCLUB_DB_PASS') ?: (getenv('DHANI_DB_PASS') ?: '')),
        ],
    ],
    'admin' => [
        'username' => getenv('ADMIN_USER') ?: (getenv('DESHCLUB_ADMIN_USER') ?: (getenv('DHANI_ADMIN_USER') ?: 'admin')),
        'password' => getenv('ADMIN_PASS') ?: (getenv('DESHCLUB_ADMIN_PASS') ?: (getenv('DHANI_ADMIN_PASS') ?: 'admin123')),
    ],
];
