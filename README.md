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
- **Advanced Editing**: Sửa thông tin ứng viên với modal đẹp mắt

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Real-time**: Supabase Realtime
- **Icons**: Lucide React

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
├── 📁 Root
│   ├── 📄 database-setup.sql          # Script thiết lập cơ sở dữ liệu Supabase
│   ├── 📄 package.json                # Quản lý dependencies và scripts
│   ├── 📄 vite.config.ts              # Cấu hình build tool Vite
│   ├── 📄 tsconfig.json               # Cấu hình TypeScript compiler
│   ├── 📄 .gitignore                  # Quy tắc bỏ qua file Git
│   └── 📄 README.md                   # Tài liệu hướng dẫn dự án
│
├── 📁 src/                            # Mã nguồn chính của ứng dụng
│   ├── 📄 main.tsx                    # Điểm khởi đầu của ứng dụng React
│   ├── 📄 App.tsx                     # Component chính của ứng dụng
│   ├── 📄 App.css                     # Styles riêng cho App component
│   ├── 📄 index.css                   # Styles toàn cục
│   ├── 📄 vite-env.d.ts              # Khai báo TypeScript cho Vite
│   │
│   ├── 📁 assets/                     # Tài nguyên tĩnh
│   │   └── 📄 react.svg               # Logo React
│   │
│   ├── 📁 contexts/                   # React Context providers
│   │   └── 📄 AuthContext.tsx         # Quản lý trạng thái đăng nhập
│   │
│   ├── 📁 lib/                        # Thư viện tiện ích và services
│   │   ├── 📄 supabase.ts             # Client Supabase và định nghĩa types
│   │   └── 📄 candidateService.ts     # Logic nghiệp vụ xử lý ứng viên
│   │
│   ├── 📁 components/                 # Các component có thể tái sử dụng
│   │   ├── 📄 ProtectedRoute.tsx      # Component bảo vệ route
│   │   └── 📁 dashboard/              # Các component dành riêng cho dashboard
│   │       ├── 📄 CandidateForm.tsx   # Form thêm ứng viên mới
│   │       ├── 📄 CandidateTable.tsx  # Bảng hiển thị danh sách ứng viên
│   │       ├── 📄 CandidateTableRow.tsx # Mỗi dòng trong bảng ứng viên
│   │       ├── 📄 EditCandidateModal.tsx # Modal sửa thông tin ứng viên
│   │       ├── 📄 DashboardHeader.tsx # Header của trang dashboard
│   │       ├── 📄 EmptyState.tsx      # Hiển thị khi không có dữ liệu
│   │       ├── 📄 ErrorDisplay.tsx    # Hiển thị thông báo lỗi
│   │       ├── 📄 LoadingSpinner.tsx  # Hiển thị trạng thái đang tải
│   │       └── 📄 Toolbar.tsx         # Thanh công cụ với tìm kiếm và lọc
│   │
│   └── 📁 pages/                      # Các component trang
│       ├── 📄 DashboardPage.tsx       # Trang chính quản lý dashboard
│       ├── 📄 LoginPage.tsx           # Trang đăng nhập
│       └── 📄 NotFoundPage.tsx        # Trang 404 không tìm thấy
│
├── 📁 public/                         # Tài nguyên công khai
│   └── 📄 vite.svg                    # Logo Vite
│
└── 📁 supabase/                       # Cấu hình Supabase
    ├── 📄 config.toml                 # Cấu hình project Supabase
    └── 📁 functions/                  # Các Edge Functions
        ├── 📁 _shared/                 # Tiện ích dùng chung
        │   └── 📄 cors.ts              # Cấu hình CORS
        └── 📁 add-candidate/           # Function thêm ứng viên
            ├── 📄 deno.json            # Cấu hình Deno runtime
            └── 📄 index.ts             # Mã nguồn function
```

## 🔍 Chi tiết các thành phần chính

### 📁 **lib/** - Business Logic Layer
- **`supabase.ts`**: Khởi tạo Supabase client, định nghĩa types và constants
- **`candidateService.ts`**: Chứa tất cả logic xử lý candidates (CRUD, upload file, realtime)

### 📁 **components/dashboard/** - Dashboard Components
- **`CandidateForm.tsx`**: Form thêm ứng viên mới với upload CV
- **`CandidateTable.tsx`**: Bảng hiển thị danh sách ứng viên
- **`CandidateTableRow.tsx`**: Mỗi dòng trong bảng với actions (sửa, xóa, thay đổi status)
- **`EditCandidateModal.tsx`**: Modal sửa thông tin ứng viên (họ tên, vị trí, ngày, CV)
- **`Toolbar.tsx`**: Thanh công cụ với search, filter và nút thêm mới
- **`DashboardHeader.tsx`**: Header với thông tin user và nút đăng xuất

### 📁 **pages/** - Page Components
- **`DashboardPage.tsx`**: Trang chính quản lý state và logic của toàn bộ dashboard
- **`LoginPage.tsx`**: Trang đăng nhập với Supabase Auth
- **`NotFoundPage.tsx`**: Trang 404

### 📁 **contexts/** - State Management
- **`AuthContext.tsx`**: Quản lý authentication state và user session

## 🚀 Tính năng mới: Sửa thông tin ứng viên

### Modal sửa thông tin ứng viên
- **Sửa họ và tên**: Cập nhật tên ứng viên
- **Sửa vị trí**: Thay đổi vị trí ứng tuyển
- **Sửa ngày ứng tuyển**: Điều chỉnh ngày ứng viên nộp hồ sơ
- **Thay thế CV**: Upload CV mới hoặc giữ nguyên CV cũ


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

### Candidate Service Methods
- **`fetchCandidates()`**: Lấy danh sách ứng viên
- **`addCandidate()`**: Thêm ứng viên mới
- **`updateCandidate()`**: Cập nhật thông tin ứng viên
- **`updateCandidateStatus()`**: Thay đổi trạng thái
- **`deleteCandidate()`**: Xóa ứng viên
- **`uploadResume()`**: Upload CV lên Storage
- **`deleteResume()`**: Xóa CV khỏi Storage

## 🐛 Xử lý sự cố

### Các vấn đề thường gặp

1. **Lỗi CORS**: Kiểm tra headers CORS trong Edge Function
2. **Lỗi RLS Policy**: Đảm bảo user đã được xác thực
3. **Lỗi Upload Storage**: Kiểm tra bucket policies
4. **Realtime không hoạt động**: Kiểm tra database triggers
5. **Modal sửa không mở**: Kiểm tra import và props của EditCandidateModal

**Lưu ý**: Đây là dự án demo tuân thủ các yêu cầu kỹ thuật cụ thể. Để sử dụng production, vui lòng review và tăng cường bảo mật theo yêu cầu thực tế.