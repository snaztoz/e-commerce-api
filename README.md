# API Project Tubes E-Commerce

## Requirements

1. Node.JS
2. Yarn
3. MySQL

## Instalasi

1. Buat database baru

2. Buat file .env (untuk format, ikuti yang ada di dalam .env.example, sesuaikan konfigurasi database)

3. Install semua dependencies

    ```bash
    yarn
    ```

4. Jalankan migration

    ```bash
    node ace migration:run
    ```

5. Jalankan seeder

    ```bash
    node ace db:seed
    ```

6. Jalankan project

    ```bash
    yarn dev
    ```

## Testing

1. Buat database baru yang diberi nama `e_commerce_testing`

2. Jalankan

    ```bash
    node ace test
    ```
