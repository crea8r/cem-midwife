# CEM Midwife (Simple Demo)

Phiên bản demo rất đơn giản cho bài toán giáo dục hộ sinh theo ca lâm sàng.

## Có gì trong demo

- 10 ca lâm sàng mẫu theo ngữ cảnh chăm sóc thai kỳ/hộ sinh
- Mỗi ca có giới hạn thời gian (countdown)
- Chọn đáp án, nộp bài, xem kết quả và giải thích
- Có thể làm lại từng ca
- Không login, không database, không lưu điểm

## Chạy local

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
npm run preview
```

## Deploy

Repo có sẵn workflow GitHub Pages (`.github/workflows/deploy-pages.yml`).
Mỗi lần push `main` sẽ tự build và deploy.
