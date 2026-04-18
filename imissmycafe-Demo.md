# imissmycafe-Demo — Project Journal

Tài liệu này ghi lại **lịch sử phát triển**, **lý do đằng sau các quyết định**, và **roadmap** của dự án.
Đây là tài liệu sản phẩm — những thứ kỹ thuật chi tiết nằm ở `CLAUDE.md`.

---

## Mục tiêu dự án

Tạo một web app nghe nhạc + ambient sounds cho không khí làm việc kiểu cafe, lấy cảm hứng từ [imissmycafe.com](https://imissmycafe.com).

**Người dùng mục tiêu:** Người làm việc/học tập muốn tạo không gian tập trung với âm thanh cafe và nhạc nền nhẹ nhàng.

---

## Lịch sử phát triển

### Giai đoạn 1 — Lập kế hoạch
- Phân tích design và tính năng của imissmycafe.com gốc
- Lên kế hoạch ban đầu với React + Vite + Zustand
- **Quyết định chuyển sang Angular + NgRx** vì phù hợp hơn với mục tiêu học tập và kiến trúc enterprise

### Giai đoạn 2 — Backend
- Xây dựng Spring Boot 3.3.4 + MySQL 8.0 (Docker)
- API cache playlist YouTube (TTL 1h) để tiết kiệm quota
- API lưu/tải sound presets

### Giai đoạn 3 — Frontend cơ bản
- Angular 21 standalone components + NgRx 19
- Web Audio API cho 8 ambient sounds
- Spotify embed + YouTube embed + toggle
- `/simplify` review: tách `sounds.config.ts`, fix N+1 NgRx effects, parallel sound loading

### Giai đoạn 4 — UI Redesign
- Thiết kế lại toàn bộ để giống imissmycafe.com
- Font Playfair Display, layout 3 cột, nền kem ấm
- Ảnh minh hoạ cafe với `mix-blend-mode: multiply`
- Sound controls minimal (không có card, sliders mỏng 2px)

### Giai đoạn 5 — Tính năng & polish
- Thêm Spotify URL input (track / playlist / album)
- Thêm YouTube playlist support
- Responsive mobile (2-cột sound grid)
- Dark mode toggle với SVG moon icon

### Giai đoạn 6 — Deploy & branding
- Deploy frontend lên **Vercel**: https://imissmycafe-demo.vercel.app
- Push code lên **GitHub**: https://github.com/Tyone37/imissmycafe-demo
- Vercel tự động deploy mỗi khi push lên GitHub (CI/CD)
- Cập nhật favicon thành icon cốc cà phê PNG tùy chỉnh

---

## Quyết định thiết kế quan trọng

### Tại sao Angular thay vì React?
Plan ban đầu dùng React + Vite + Zustand. Chuyển sang Angular vì kiến trúc NgRx phù hợp hơn cho state management phức tạp (audio + music + settings), và mục tiêu học framework enterprise.

### Tại sao iframe embed thay vì Spotify Web Playback SDK?
SDK yêu cầu Spotify Premium — phần lớn người dùng demo không có. iframe embed hoạt động với free account (30s preview) và không cần OAuth. Đủ dùng cho mục đích demo.

### Tại sao không dùng YouTube IFrame API (custom player)?
Đã đánh giá: YouTube IFrame API cho phép build UI tùy chỉnh hoàn toàn, nhưng tốn ~1 ngày code thêm. iframe embed đơn giản hơn nhiều và cho kết quả tương đương với playlist support. Quyết định: dùng iframe, tiết kiệm thời gian cho tính năng quan trọng hơn.

### Tại sao bỏ Ko-fi button, Info icon, Pomodoro timer?
Người dùng quyết định bỏ — muốn UI tối giản, tập trung vào core experience (nhạc + ambient). Các feature này có thể thêm sau nếu cần.

### Tại sao `src/assets/` thay vì `public/`?
Angular 18+ mặc định dùng `public/` cho static assets. Dự án đã tạo files trong `src/assets/` theo convention cũ. Giải pháp: thêm entry trong `angular.json` để serve cả hai, không cần di chuyển files.

---

## Tính năng hiện tại ✅

| Tính năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Spotify embed | ✅ | track / playlist / album, dán link để đổi |
| YouTube embed | ✅ | video / playlist, dán link để đổi |
| Toggle Spotify ↔ YouTube | ✅ | pill-track style |
| 8 Ambient sounds | ✅ | volume slider + pan |
| Dark mode | ✅ | lưu localStorage |
| Responsive mobile | ✅ | 1 cột, sound grid 2 cột |
| Cafe illustration | ✅ | mix-blend-mode với nền |
| Backend API (playlist cache) | ✅ | TTL 1h, MySQL |
| Backend API (presets) | ✅ | CRUD |

---

## Roadmap — Chưa làm

### Cần cho production
- [ ] Deploy frontend lên Vercel
- [ ] Deploy backend lên Railway/Render
- [ ] Cấu hình CORS cho domain production
- [ ] Thêm YouTube API key thật vào backend env

### Nice to have
- [ ] Lưu volume/pan preferences vào localStorage (hiện tại reset khi reload)
- [ ] Save preset lên backend (UI để đặt tên + lưu)
- [ ] Keyboard shortcuts (Space = stop all, S/Y = toggle provider)
- [ ] PWA — offline support cho sounds đã load

### Đã cân nhắc nhưng không làm
- **Spotify Web Playback SDK** — yêu cầu Premium, không xứng công sức cho demo
- **Pomodoro timer** — người dùng không muốn
- **Ko-fi donation button** — người dùng không muốn
- **Custom YouTube player UI** — iframe đủ dùng

---

## Tech Stack thực tế

```
Frontend:  Angular 21 + NgRx 19 + Tailwind CSS v4
Backend:   Java 17 + Spring Boot 3.3.4
Database:  MySQL 8.0 (Docker)
Audio:     Web Audio API (self-hosted MP3)
Music:     Spotify Embed iframe + YouTube Embed iframe
Deploy:    Vercel (FE) + Railway/Render (BE) — chưa deploy
```

---

## Nguồn âm thanh

8 file MP3 ambient tải từ Mixkit (free license), host tại `frontend/src/assets/sounds/`:
`barista.mp3`, `rain.mp3`, `fireplace.mp3`, `keyboard.mp3`, `chatter.mp3`, `jazz.mp3`, `wind.mp3`, `whitenoise.mp3`
