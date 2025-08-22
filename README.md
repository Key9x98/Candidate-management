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

#### B. Setup Database
1. Vào SQL Editor trong Supabase Dashboard
2. Chạy script `database-setup.sql` để tạo bảng và policies

#### C. Setup Storage
1. Vào Storage trong Supabase Dashboard
2. Tạo bucket mới tên `resumes`
3. Set bucket policy:
```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'resumes');

-- Allow users to view their own files
CREATE POLICY "Allow users to view own files" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own files
CREATE POLICY "Allow users to delete own files" ON storage.objects
FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

#### D. Deploy Edge Function
1. Cài đặt Supabase CLI:
```bash
npm install -g supabase
```

2. Login và link project:
```bash
supabase login
supabase link --project-ref your_project_ref
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
src/
├── components/          # React components
│   ├── Auth.tsx        # Authentication wrapper
│   ├── Dashboard.tsx   # Main dashboard
│   ├── SignInForm.tsx  # Sign in form
│   └── SignUpForm.tsx  # Sign up form
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/               # Utilities and services
│   ├── supabase.ts    # Supabase client & types
│   └── candidateService.ts # Candidate business logic
└── main.tsx          # App entry point
```

## 🔐 Bảo mật

### Row Level Security (RLS)
- Users chỉ có thể truy cập dữ liệu của chính mình
- Policies được áp dụng cho tất cả operations (SELECT, INSERT, UPDATE, DELETE)

### Storage Security
- Files được tổ chức theo user ID
- Users chỉ có thể upload/download files của chính mình

### Edge Functions
- JWT token validation
- Input validation và sanitization
- Error handling an toàn

## 📊 Database Schema

```sql
candidates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  applied_position TEXT NOT NULL,
  status TEXT DEFAULT 'New',
  resume_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

## 🔄 Realtime Features

- **Automatic Updates**: Dashboard tự động cập nhật khi có thay đổi
- **Multi-user Support**: Nhiều users có thể làm việc đồng thời
- **Efficient Sync**: Chỉ fetch lại data khi cần thiết

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
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

### Debug Mode
```bash
# Enable debug logging
DEBUG=supabase:* npm run dev
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra documentation
2. Tìm trong issues
3. Tạo issue mới với thông tin chi tiết

---

**Lưu ý**: Đây là dự án demo tuân thủ các yêu cầu kỹ thuật cụ thể. Để sử dụng production, vui lòng review và tăng cường bảo mật theo yêu cầu thực tế.
