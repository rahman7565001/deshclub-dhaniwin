#!/bin/bash
set -e

# Render assigns a dynamic port via $PORT (defaults to 80 if not set)
PORT="${PORT:-80}"

# Configure Apache to listen on Render's PORT
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf 2>/dev/null || true
echo "Listen ${PORT}" > /etc/apache2/ports.conf

# Ensure api/storage directory and SQLite database have full read/write permissions
mkdir -p /var/www/html/api/storage
chown -R www-data:www-data /var/www/html/api/storage
chmod -R 777 /var/www/html/api/storage

if [ -f /var/www/html/api/storage/deshclub.sqlite ]; then
    chown www-data:www-data /var/www/html/api/storage/deshclub.sqlite
    chmod 666 /var/www/html/api/storage/deshclub.sqlite
fi

echo "=========================================="
echo " Starting Deshclub Apache on port ${PORT} "
echo "=========================================="

exec apache2-foreground
