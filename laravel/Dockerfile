FROM php:8.4-cli

# PostgreSQL ve zip için gerekli sistem paketleri
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer'ı resmi imajdan kopyala
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Önce sadece composer dosyalarını kopyala (cache için)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Geri kalan dosyaları kopyala
COPY . .

# Storage klasörlerine yazma izni ver
RUN mkdir -p storage/logs storage/framework/cache \
    storage/framework/sessions storage/framework/views \
    && chmod -R 777 storage bootstrap/cache

EXPOSE 10000

CMD php artisan config:cache && php artisan serve --host=0.0.0.0 --port=10000
