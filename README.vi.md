# SLM Tiny Step 🐾

[English](README.md) | [Tiếng Việt](README.vi.md)

> **Lập kế hoạch tất định, Phân mảnh ngữ cảnh & Bộ nhớ vi tác vụ cho AI Agent (Tối ưu đặc biệt cho các mô hình nhỏ như LFM-3, OpenCode, Codex, Antigravity, Claude Code, Cursor).**

Khi lập trình với các mô hình ngôn ngữ nhỏ (SLM) như **LFM-3**, AI rất hay gặp hiện tượng **trôi ngữ cảnh (context drift)**, **quên các bước trước đó**, hoặc **viết code nửa chừng rồi dừng lại**. Skill `slm-tiny-step` giải quyết triệt để vấn đề này thông qua các nguyên tắc cơ bản:

1. **Cấm code khi chưa có plan:** Bắt buộc lập kế hoạch trước khi code đối với các tác vụ chạm $\ge 2$ file hoặc $> 30$ dòng code.
2. **Phân mảnh ngữ cảnh trên đĩa (Context Sharding):** Kế hoạch được chia nhỏ thành các file markdown độc lập (`.atomic/00_roadmap.md`, `01_phase.md`), giữ ngữ cảnh active luôn $< 300$ tokens ở mọi thời điểm.
3. **Mỗi lượt chỉ làm 1 việc (One Step Per Turn):** Mỗi phản hồi chỉ được thực thi **duy nhất 1 vi tác vụ** ($\le 30-40$ dòng code) và neo ngữ cảnh bằng con trỏ 3 điểm `[ATOMIC STATE]`.

---

## ⚡ Cài đặt 1 lệnh duy nhất (Không cần clone repo)

Chạy trực tiếp từ terminal với `npx` (hoạt động ngay trên Windows, macOS và Linux):

```bash
npx github:TuilaTammmmm/slm-tiny-step
```

---

## 🖥️ Giao diện lựa chọn tương tác trong Terminal

Khi chạy lệnh trên, menu tương tác sẽ xuất hiện:

```text
   =====================================================
               SLM TINY STEP SKILL INSTALLER            
        Deterministic Planning & Micro-Step Memory      
   =====================================================

  Select installation scope:

  [1] Global - Entire system (Available to all projects with @slm-tiny-step)
  [2] Folder - Current directory (Installs .agents/skills for this project)

  Enter choice [1/2] (Default: 1): 
```

- **[1] Global:** Cài đặt vào cấu hình hệ thống (`~/.gemini`, `~/.config/opencode`, `~/.claude`, `~/.codex`). Mọi dự án trên máy tính đều có thể gọi `@slm-tiny-step`.
- **[2] Folder:** Cài đặt vào thư mục dự án hiện tại (`.agents/skills/slm-tiny-step` và `.agents/rules/`). Thích hợp để commit lên Git dùng chung cho cả team.

*(Bạn có thể bỏ qua bước hỏi bằng cách truyền trực tiếp: `npx github:TuilaTammmmm/slm-tiny-step global` hoặc `npx github:TuilaTammmmm/slm-tiny-step folder`)*

---

## 🎯 Cách gọi Agent với `@slm-tiny-step`

Sau khi cài đặt (dù chọn Global hay Folder), bạn có thể gọi Agent bằng các cách:

1. **Gõ trực tiếp `@` trong khung chat:**
   > *"@slm-tiny-step hãy refactor luồng authentication"*

2. **Hoặc ra lệnh bằng câu nói tự nhiên:**
   > *"Áp dụng skill slm-tiny-step để viết chức năng upload file"*

---

## 🔄 Quy trình AI thực thi công việc

```
[Nhận yêu cầu của User]
       │
       ▼
[Kiểm tra thư mục .atomic/]
       │
       ├─► Chưa có ──► Bước 1: Tạo .atomic/00_roadmap.md (Chỉ liệt kê các phase lớn)
       │
       └─► Đã có ────► Bước 2: Mở file phase đang kích hoạt (vd: .atomic/01_auth.md)
                               │
                               ▼
                       Bước 3: Thực thi ĐÚNG 1 vi tác vụ ([>])
                               - In khối neo [ATOMIC STATE]
                               - Viết code (<= 30-40 dòng)
                               - Đánh dấu [x] ngay trên file đĩa
                               │
                               ▼
                       Bước 4: Khi tất cả task trong phase đã [x]:
                               - Đánh dấu [x] phase đó trong 00_roadmap.md
                               - Chuyển mũi tên [>] sang phase kế tiếp
```

---

## 📂 Cấu trúc Repository tinh gọn

```text
slm-tiny-step/
├── package.json              # Định nghĩa npm package
├── bin/
│   └── cli.js                # Trình cài đặt Node.js đa nền tảng (Zero dependency)
├── SKILL.md                  # Hướng dẫn cốt lõi & Quy tắc máy trạng thái
├── resources/                # Template roadmap, phase và con trỏ 3 điểm
├── references/               # Đặc tả kỹ thuật & logic quyết định
├── examples/                 # Hướng dẫn thực chiến mẫu JWT auth
├── README.md                 # Tài liệu Tiếng Anh
└── README.vi.md              # Tài liệu Tiếng Việt
```
