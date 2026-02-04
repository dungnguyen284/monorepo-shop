# Monorepo Shop

Một ứng dụng e-commerce sử dụng kiến trúc monorepo với **Turborepo**, **NestJS** (API) và **Next.js** (Web).

## 📋 Mục lục

- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Cài đặt](#-cài-đặt)
- [Cấu hình môi trường](#-cấu-hình-môi-trường)
- [Chạy với Docker](#-chạy-với-docker)
- [Database & Migrations](#-database--migrations)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Scripts](#-scripts)
- [API Endpoints](#-api-endpoints)

---

## 💻 Yêu cầu hệ thống

- **Node.js** >= 18.x
- **pnpm** >= 10.x
- **Docker** & **Docker Compose** (để chạy PostgreSQL)

```bash
# Cài đặt pnpm nếu chưa có
npm install -g pnpm
```

---

## 📁 Cấu trúc dự án

```
monorepo-shop/
├── apps/
│   ├── api/                 # NestJS Backend API (port 3001)
│   │   ├── src/
│   │   │   ├── common/      # Guards, Filters, Interceptors, Utils
│   │   │   ├── database/    # TypeORM config & Migrations
│   │   │   ├── entities/    # Database entities
│   │   │   └── modules/     # Feature modules (auth, product...)
│   │   └── package.json
│   │
│   └── web/                 # Next.js Frontend (port 3000)
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   ├── context/     # React Context (Auth...)
│       │   ├── services/    # API services
│       │   └── lib/         # Utilities (axios...)
│       └── package.json
│
├── packages/
│   └── shared/              # Shared types, DTOs, Zod schemas
│       ├── dto/             # Data Transfer Objects
│       └── schemas/         # Zod validation schemas
│
├── docker-compose.yaml      # PostgreSQL container
├── turbo.json               # Turborepo config
├── pnpm-workspace.yaml      # pnpm workspace config
└── package.json             # Root package.json
```

---

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd monorepo-shop
```

### 2. Cài đặt dependencies

```bash
pnpm install
```

---

## ⚙️ Cấu hình môi trường

### API (.env)

Tạo file `apps/api/.env`:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=my-shop

# hoặc dùng DATABASE_URL
DATABASE_URL=postgresql://postgres:1234@localhost:5432/my-shop

# JWT
AUTH_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

### Web (.env.local)

Tạo file `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> 💡 Xem file mẫu: `apps/web/.env.example`

---

## 🐳 Chạy với Docker

### Khởi động PostgreSQL

```bash
# Khởi động database
docker compose up -d

# Kiểm tra trạng thái
docker compose ps

# Xem logs
docker compose logs -f postgres

# Dừng database
docker compose down

# Dừng và xóa data
docker compose down -v
```

### Thông tin kết nối PostgreSQL

| Thuộc tính | Giá trị   |
| ---------- | --------- |
| Host       | localhost |
| Port       | 5432      |
| Database   | my-shop   |
| Username   | postgres  |
| Password   | 1234      |

---

## 🗄️ Database & Migrations

### Chạy migrations

```bash
cd apps/api

# Xem danh sách migrations
pnpm migration:show

# Chạy tất cả migrations pending
pnpm migration:run

# Revert migration gần nhất
pnpm migration:revert
```

### Tạo migration mới

```bash
cd apps/api

# Tạo migration từ thay đổi entities (auto-generate)
pnpm migration:generate MigrationName

# Tạo migration rỗng (manual)
pnpm migration:create MigrationName
```

### Schema commands

```bash
cd apps/api

# Sync schema (⚠️ CHỈ DÙNG TRONG DEVELOPMENT)
pnpm schema:sync

# Drop toàn bộ schema (⚠️ XÓA TẤT CẢ DATA)
pnpm schema:drop
```

---

## ▶️ Chạy ứng dụng

### Development mode

```bash
# Chạy tất cả apps (API + Web) cùng lúc
pnpm dev

# Hoặc chạy riêng từng app
cd apps/api && pnpm start:dev   # API với hot-reload
cd apps/web && pnpm dev         # Web với hot-reload
```

### Production mode

```bash
# Build tất cả
pnpm build

# Chạy production
cd apps/api && pnpm start:prod
cd apps/web && pnpm start
```

### Truy cập ứng dụng

| App            | URL                   |
| -------------- | --------------------- |
| Web (Frontend) | http://localhost:3000 |
| API (Backend)  | http://localhost:3001 |

---

## 📜 Scripts

### Root (Turborepo)

| Script       | Mô tả                                 |
| ------------ | ------------------------------------- |
| `pnpm dev`   | Chạy tất cả apps ở chế độ development |
| `pnpm build` | Build tất cả packages và apps         |
| `pnpm lint`  | Lint tất cả packages và apps          |
| `pnpm test`  | Chạy tests                            |
| `pnpm clean` | Xóa cache Turbo và node_modules       |

### API (apps/api)

| Script                    | Mô tả                          |
| ------------------------- | ------------------------------ |
| `pnpm start:dev`          | Chạy với hot-reload            |
| `pnpm start:prod`         | Chạy production mode           |
| `pnpm build`              | Build TypeScript               |
| `pnpm lint`               | Lint code                      |
| `pnpm test`               | Chạy unit tests                |
| `pnpm test:e2e`           | Chạy E2E tests                 |
| `pnpm migration:run`      | Chạy migrations                |
| `pnpm migration:generate` | Generate migration từ entities |
| `pnpm migration:revert`   | Revert migration               |

### Web (apps/web)

| Script       | Mô tả                   |
| ------------ | ----------------------- |
| `pnpm dev`   | Chạy Next.js dev server |
| `pnpm build` | Build production        |
| `pnpm start` | Chạy production server  |
| `pnpm lint`  | Lint code               |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint         | Mô tả                                   |
| ------ | ---------------- | --------------------------------------- |
| POST   | `/auth/register` | Đăng ký tài khoản mới                   |
| POST   | `/auth/login`    | Đăng nhập                               |
| GET    | `/auth/me`       | Lấy thông tin user hiện tại (cần token) |

### Products

| Method | Endpoint        | Mô tả                        |
| ------ | --------------- | ---------------------------- |
| GET    | `/products`     | Lấy danh sách sản phẩm       |
| GET    | `/products/:id` | Lấy chi tiết sản phẩm        |
| POST   | `/products`     | Tạo sản phẩm mới (cần auth)  |
| PATCH  | `/products/:id` | Cập nhật sản phẩm (cần auth) |
| DELETE | `/products/:id` | Xóa sản phẩm (cần auth)      |

---

## 🔧 Tech Stack

### Backend (API)

- **NestJS** - Node.js framework
- **TypeORM** - ORM cho PostgreSQL
- **PostgreSQL** - Database
- **JWT** - Authentication

### Frontend (Web)

- **Next.js 16** - React framework (App Router)
- **React 19** - UI library
- **TailwindCSS 4** - Styling
- **TanStack Query** - Data fetching & caching
- **Axios** - HTTP client
- **Zod** - Schema validation

### Monorepo

- **Turborepo** - Build system
- **pnpm** - Package manager

---

## 📝 Workflow phát triển

### 1. Khởi động môi trường

```bash
# 1. Khởi động PostgreSQL
docker compose up -d

# 2. Chạy migrations
cd apps/api && pnpm migration:run

# 3. Chạy dev server
cd ../.. && pnpm dev
```

### 2. Thêm entity mới

```bash
# 1. Tạo entity trong apps/api/src/entities/

# 2. Generate migration
cd apps/api && pnpm migration:generate AddNewEntity

# 3. Chạy migration
pnpm migration:run
```

### 3. Thêm shared types

```bash
# 1. Thêm types/schemas vào packages/shared/

# 2. Export trong packages/shared/index.ts

# 3. Import trong apps:
import { MyType } from "@monorepo-shop/shared";
```

---

## 🐛 Troubleshooting

### CORS Error

Đảm bảo API đã enable CORS trong `apps/api/src/main.ts`:

```typescript
app.enableCors({
	origin: ["http://localhost:3000"],
	credentials: true,
});
```

### Database connection error

```bash
# Kiểm tra PostgreSQL đang chạy
docker compose ps

# Restart nếu cần
docker compose restart postgres
```

### Migration error

```bash
# Xem migrations đã chạy
cd apps/api && pnpm migration:show

# Sync lại schema (chỉ dev)
pnpm schema:sync
```

---

## 📄 License

ISC
