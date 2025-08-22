# HR Candidate Manager

Hệ thống quản lý hồ sơ ứng viên được xây dựng với React + TypeScript và Supabase, tuân thủ các yêu cầu kỹ thuật về bảo mật, realtime updates và Edge Functions.

## 🚀 Tính năng chính

- **Authentication**: Đăng nhập/đăng ký với Supabase Auth
- **CRUD Operations**: Thêm, sửa, xóa, xem ứng viên
- **File Upload**: Tải lên CV/PDF với Supabase Storage
- **Realtime Updates**: Cập nhật realtime khi có thay đổi
- **Row Level Security**: Bảo mật dữ liệu theo từng user
- **Edge Functions**: Xử lý logic backend an toàn
- **Excel-like Interface**: Giao diện dạng bảng dễ sử dụng

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Real-time**: Supabase Realtime

## 📋 Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn
- Tài khoản Supabase

## 🔧 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd Candidate-management
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Tạo file environment
Tạo file `.env.local` trong thư mục gốc:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup Supabase

#### A. Tạo project mới trên Supabase
1. Truy cập [supabase.com](https://supabase.com)
2. Tạo project mới
3. Lấy `URL` và `anon key` từ Settings > API

#### B. Setup Database & Storage (tự động)
1. Vào SQL Editor trong Supabase Dashboard
2. Chạy script `database-setup.sql`
   - Tạo bảng `candidates`, indexes, trigger `updated_at`
   - Bật RLS và tạo đầy đủ policies cho bảng
   - Tạo (hoặc cập nhật) bucket Storage `resumes` và các policies cần thiết
   - Script an toàn để chạy lại nhiều lần (idempotent)

#### C. (Tuỳ chọn) Kiểm tra Storage
Script ở bước B đã tạo bucket `resumes` public-read và policies cho upload/delete theo `auth.uid()`. Bạn có thể kiểm tra trong mục Storage nếu cần.

#### D. Deploy Edge Function
1. Cài đặt Supabase CLI:
```bash
npm install -g supabase
```

2. Login và link project:
```bash
supabase login
```

3. Deploy function:
```bash
supabase functions deploy add-candidate
```

### 5. Chạy ứng dụng
```bash
npm run dev
```

## 🏗️ Cấu trúc dự án

```
Candidate-management/
├── database-setup.sql
├── index.html
├── package.json
├── vite.config.ts
├── README.md
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── assets/
│   │   └── react.svg
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── candidateService.ts
│   ├── components/
│   │   ├── ProtectedRoute.tsx
│   │   └── dashboard/
│   │       ├── CandidateForm.tsx
│   │       ├── CandidateTable.tsx
│   │       ├── CandidateTableRow.tsx
│   │       ├── DashboardHeader.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorDisplay.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── Toolbar.tsx
│   └── pages/
│       ├── DashboardPage.tsx
│       ├── LoginPage.tsx
│       └── NotFoundPage.tsx
├── public/
│   └── vite.svg
└── supabase/
    ├── config.toml
    └── functions/
        ├── _shared/
        │   └── cors.ts
        └── add-candidate/
            ├── deno.json
            └── index.ts
```

## 📝 API Documentation

### Edge Function: add-candidate
- **Endpoint**: `/functions/v1/add-candidate`
- **Method**: POST
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Body**:
```json
{
  "full_name": "string",
  "applied_position": "string",
  "status": "New|Interviewing|Hired|Rejected",
  "resume_url": "string (optional)"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Error**: Kiểm tra Edge Function CORS headers
2. **RLS Policy Error**: Đảm bảo user đã authenticated
3. **Storage Upload Error**: Kiểm tra bucket policies
4. **Realtime Not Working**: Kiểm tra database triggers

**Lưu ý**: Đây là dự án demo tuân thủ các yêu cầu kỹ thuật cụ thể. Để sử dụng production, vui lòng review và tăng cường bảo mật theo yêu cầu thực tế.
