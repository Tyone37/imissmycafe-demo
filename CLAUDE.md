# imissmycafe-Demo — CLAUDE.md

Tài liệu này định hướng cho Claude Code khi làm việc trong project này.

---

## Tổng quan dự án

**imissmycafe-Demo** là web app nghe nhạc + ambient sounds cho không gian làm việc kiểu cafe,
lấy cảm hứng từ imissmycafe.com.

| Hạng mục | Chi tiết |
|----------|----------|
| Frontend | Angular 21 (TypeScript, Standalone Components) ✅ Done — UI redesigned to match imissmycafe.com |
| Backend  | Java 17 + Spring Boot 3.3.4 ✅ Done |
| Database | MySQL 8.0 (Docker) ✅ Running |
| State    | NgRx 19 (Store + Effects) |
| Styling  | Tailwind CSS v4 |
| Deploy   | Vercel (frontend) + Railway/Render (backend) |

---

## Cấu trúc thư mục

```
imissmycafe-Demo/
├── frontend/                        # Angular app
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                # Singleton services, guards, interceptors
│   │   │   │   ├── services/        # AudioService, YouTubeService, SpotifyService
│   │   │   │   └── interceptors/    # HTTP interceptors (auth header, error handling)
│   │   │   ├── shared/              # Dùng chung: pipes, directives, UI components nhỏ
│   │   │   ├── features/            # Tính năng chính (lazy-loaded modules)
│   │   │   │   ├── music-player/    # Spotify + YouTube player + toggle
│   │   │   │   ├── sound-controls/  # 8 ambient sounds với volume/pan
│   │   │   │   └── settings/        # Dark mode, preferences
│   │   │   ├── store/               # NgRx store (actions, reducers, effects, selectors)
│   │   │   └── app.component.ts
│   │   ├── assets/
│   │   │   └── sounds/              # 8 file MP3 ambient (tự host)
│   │   └── environments/
│   └── angular.json
│
├── backend/                         # Spring Boot app
│   └── src/main/
│       ├── java/com/imissmycafe/
│       │   ├── controller/          # REST Controllers (tầng C trong MVC)
│       │   ├── service/             # Business logic (tầng M - service layer)
│       │   ├── repository/          # JPA Repositories (data access)
│       │   ├── model/               # JPA Entities (tầng M - data model)
│       │   ├── dto/                 # Data Transfer Objects (request/response)
│       │   └── config/              # Spring config (CORS, Security, etc.)
│       └── resources/
│           ├── application.yml      # Cấu hình chính
│           └── db/
│               └── init.sql         # Schema khởi tạo MySQL
│
├── docker-compose.yml               # MySQL container
└── CLAUDE.md
```

---

## Kiến trúc MVC

### Backend (Spring Boot)

```
Request → Controller → Service → Repository → MySQL
              ↓            ↓
             DTO         Model (Entity)
```

- **Controller** (`/controller`): Nhận HTTP request, validate input, trả về response. Không chứa business logic.
- **Service** (`/service`): Toàn bộ business logic, gọi repository, xử lý ngoại lệ.
- **Repository** (`/repository`): Interface JPA, chỉ chứa query đến DB.
- **Model** (`/model`): JPA Entity ánh xạ với bảng MySQL.
- **DTO** (`/dto`): Object trung gian, không expose trực tiếp Entity ra ngoài.

### Frontend (Angular)

```
Component (View) ↔ NgRx Store (State) ↔ Effects → Backend API
                                            ↓
                                       Core Services
```

- **Component**: Chỉ lo render UI và dispatch action — không chứa logic.
- **NgRx Effects**: Gọi HTTP, xử lý async.
- **Core Services**: AudioService (Web Audio API), YouTubeService (IFrame API proxy).

---

## Database (MySQL via Docker)

```
Container: imissmycafe-mysql
Host:      localhost:3306
Database:  imissmycafe_db
User:      cafe_user / cafe1234
Root:      root / root1234
```

Khởi động / tắt:
```bash
docker compose up -d      # Bật MySQL
docker compose down       # Tắt (data vẫn giữ)
docker compose down -v    # Tắt + xóa data
```

---

## Backend — Spring Boot conventions

### Đặt tên

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Controller | `*Controller` | `PlaylistController` |
| Service interface | `*Service` | `PlaylistService` |
| Service impl | `*ServiceImpl` | `PlaylistServiceImpl` |
| Repository | `*Repository` | `PlaylistRepository` |
| Entity | PascalCase noun | `SoundPreset` |
| DTO | `*Request` / `*Response` | `PlaylistCacheResponse` |

### REST API — đã implement ✅

```
GET    /api/playlists/{provider}/{playlistId}        # Playlist (cache DB TTL 1h → YouTube API)
DELETE /api/playlists/{provider}/{playlistId}/cache  # Force xóa cache
GET    /api/presets                                  # Lấy tất cả presets
GET    /api/presets/{id}                             # Lấy 1 preset
POST   /api/presets                                  # Tạo preset mới
DELETE /api/presets/{id}                             # Xóa preset
```

### application.yml (template)

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/imissmycafe_db
    username: cafe_user
    password: cafe1234
  jpa:
    hibernate:
      ddl-auto: validate          # Dùng init.sql, không để Hibernate tự tạo bảng
    show-sql: true

youtube:
  api-key: ${YOUTUBE_API_KEY}    # Lấy từ env, không hardcode

server:
  port: 8080
```

---

## Frontend — Angular conventions

### Đặt tên component

```
feature/music-player/
├── music-player.component.ts       # Logic
├── music-player.component.html     # Template
├── music-player.component.scss     # Style
└── music-player.module.ts          # Module (lazy load)
```

### NgRx Store structure ✅ Done

```
store/
├── audio/
│   ├── audio.actions.ts    (toggleSound, setVolume, setPan, stopAll, loadPresets)
│   ├── audio.reducer.ts    (SoundState per sound)
│   ├── audio.effects.ts    (sync NgRx → Web Audio API)
│   └── audio.selectors.ts
├── music/
│   ├── music.actions.ts    (setProvider, setSpotifyPlaylist, setYouTubePlaylist)
│   ├── music.reducer.ts
│   └── music.selectors.ts
└── app.state.ts
```

### Features ✅ Done

```
features/
├── music-player/     # Spotify embed + YouTube embed + toggle
├── sound-controls/   # 8 sliders volume/pan, Stop All
└── settings/         # Dark mode toggle (lưu localStorage, class .dark trên <html>)
```

### Lưu ý Tailwind v4 + Angular

- Dùng `styles.css` (không phải `.scss`) cho global styles — Sass `@import` không tương thích Tailwind v4
- Component styles vẫn dùng `.scss` bình thường
- `@import "tailwindcss"` chỉ đặt trong `src/styles.css`

### UI Design ✅ Done (redesigned to match imissmycafe.com)

- Font: **Playfair Display** (Google Fonts, 700/900 weight + italic) — load trong `index.html`
- Title: `font-size: 3rem`, `font-weight: 900`
- Layout: 3 cột `300px / 1fr / 280px` — title+tagline+player | illustration | sound controls
  - Tablet (≤1024px): ẩn cột giữa, 2 cột `280px 1fr`
  - Mobile (≤640px): 1 cột, sound list hiển thị dạng 2 cột
- `app.ts` quản lý dark mode trực tiếp (không qua SettingsComponent)
- Dark mode toggle: floating circle button top-right, icon SVG mặt trăng filled (☀ khi dark mode)
- `assets/` phải khai báo trong `angular.json` với `input: "src/assets", output: "assets"` (Angular 18+ dùng `public/` mặc định)
- Illustration: `assets/cafe-illustration.png` với `mix-blend-mode: multiply` (light) / `screen` (dark)
- Sound controls: minimal, no card/box — thin 2px slider track, 10px dot thumb, `--slider-track` CSS var
- Sound row: grid `22px 90px 1fr` — play button tròn (SVG ▶/■) | tên | volume slider
- CSS vars: `--color-bg: #f5e6d3`, `--color-primary: #6B705C`, `--slider-track` cho dark/light mode

### Environment variables

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api',
  // YouTube API key để trống — backend proxy, không hardcode ở frontend
  spotifyPlaylistId: '42lVtzJzGUCZ5AsMeetaaS',
  youtubePlaylistId: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
};
```

---

## Comment conventions trong code

### Java (Javadoc cho public method)
```java
/**
 * Lấy playlist từ YouTube API, ưu tiên cache trong DB (TTL 1 giờ).
 *
 * @param playlistId ID playlist YouTube
 * @return danh sách video trong playlist
 */
public PlaylistResponse getYouTubePlaylist(String playlistId) { ... }
```

### TypeScript (JSDoc cho service/store)
```typescript
/**
 * Phát âm thanh ambient với volume và pan đã lưu.
 * Nếu AudioContext chưa khởi tạo, tạo mới (lazy init để tránh autoplay policy).
 */
playSound(soundId: string): void { ... }
```

**Quy tắc comment:**
- Comment giải thích **tại sao** (why), không giải thích what (code tự nói lên điều đó)
- Comment bắt buộc cho: workaround browser quirks, business rule không hiển nhiên, quota/rate limit logic
- Không comment từng dòng code hiển nhiên

---

## Tính năng chính

### Music Player ✅ Done
- **Toggle**: Chuyển Spotify ↔ YouTube — dạng pill-track (2 nút trong 1 track nền)
- **Spotify**: iframe embed dark theme, hỗ trợ track / playlist / album
  - Nút "change track / playlist" → input nhận URL `open.spotify.com/track|playlist|album/ID` hoặc URI `spotify:track:ID`
- **YouTube**: iframe embed, default video `CWVUkdllAWk`
  - Nút "change video / playlist" → input nhận video URL, playlist URL (`?list=ID`), bare ID
  - Playlist embed dùng `youtube.com/embed/videoseries?list=ID`
- **NgRx store** (`music/`):
  - `spotifyType: 'track' | 'playlist' | 'album'` + `spotifyId: string`
  - `youtubeType: 'video' | 'playlist'` + `youtubeId: string`
  - Actions: `setSpotifyContent`, `setYouTubeContent`, `setProvider`

### Ambient Sounds (8 loại) ✅ Files có sẵn
| Sound | File | Label hiển thị |
|-------|------|----------------|
| Barista / coffee machine | `barista.mp3` | Barista |
| Rain | `rain.mp3` | Rainy Day |
| Fireplace | `fireplace.mp3` | Fireplace |
| Keyboard typing | `keyboard.mp3` |
| People chatter | `chatter.mp3` |
| Jazz music (soft) | `jazz.mp3` |
| Wind | `wind.mp3` |
| White noise | `whitenoise.mp3` |

Mỗi sound: volume slider (0–100) + pan toggle + pan slider (L/R).

### Preferences
- Lưu vào `localStorage` (Angular) và có thể sync lên DB qua `/api/presets`
- Dark mode toggle, lưu persistent

---

## Quy trình phát triển

```bash
# Backend
cd backend
./mvnw spring-boot:run         # Chạy dev server (port 8080)
./mvnw test                    # Chạy unit tests
./mvnw package                 # Build JAR

# Frontend
cd frontend
npm install
npx ng serve                   # Chạy dev server (port 4200)
npx ng test                    # Unit tests (Jest)
npx ng build --configuration=production

# Database
docker compose up -d           # Bật MySQL trước khi chạy backend
```

---

## Lưu ý quan trọng

1. **Không hardcode API key** — luôn dùng environment variable
2. **YouTube API quota**: 10,000 units/ngày. Backend **phải** cache kết quả playlist vào DB (TTL 1h) trước khi gọi lại API
3. **CORS**: Backend cấu hình chỉ cho phép `localhost:4200` (dev) và domain Vercel (prod)
4. **init.sql** chạy 1 lần duy nhất khi volume Docker lần đầu tạo — nếu cần reset thì `docker compose down -v`
5. **ddl-auto: validate** — schema do `init.sql` quản lý, không để Hibernate tự alter bảng