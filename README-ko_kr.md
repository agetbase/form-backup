# form-backup &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/agetbase/form-backup/blob/main/LICENSE) [![NPM badge](https://img.shields.io/npm/v/form-backup?logo=npm)](https://www.npmjs.com/package/form-backup)

[English](https://github.com/agetbase/form-backup/blob/main/README.md) | 한국어 | [简体中文](https://github.com/agetbase/form-backup/blob/main/README-zh_hans.md) | [日本語](https://github.com/agetbase/form-backup/blob/main/README-ja_jp.md)

form-backup은 웹 애플리케이션에서 폼 데이터를 자동으로 저장하고 복원할 수 있는 간편한 라이브러리입니다.

- **자동 백업**: 폼 데이터를 localStorage 또는 sessionStorage에 자동 저장
- **TTL 지원**: 저장된 데이터에 만료 시간 설정 가능
- **필드 제외**: 비밀번호 등 민감한 필드를 백업에서 제외
- **TypeScript 지원**: 완벽한 타입 정의 제공
- **경량**: 의존성 없는 순수 JavaScript

## 설치

```bash
npm install form-backup
```

## 예제

```typescript
import { createFormBackup } from 'form-backup';

// FormBackup 인스턴스 생성
const backup = createFormBackup('signup-form', {
  exclude: ['password'], // 제외할 필드
  ttl: 30 * 60 * 1000, // 30분 (밀리초)
  storage: 'local', // 'local' 또는 'session'
});

// 폼 데이터 저장
backup.save({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secret123', // exclude에 포함되어 저장 안 됨
  newsletter: true,
});

// 폼 데이터 복원
const data = backup.restore();
if (data) {
  console.log(data);
  // { name: 'John Doe', email: 'john@example.com', newsletter: true }
}

// 저장된 데이터 확인
if (backup.exists()) {
  console.log('백업 데이터가 존재합니다');
}

// 남은 TTL 확인
const remaining = backup.getRemainingTTL();
if (remaining) {
  console.log(`남은 시간: ${remaining}ms`);
}

// 저장된 데이터 삭제
backup.clear();
```

## API

### `createFormBackup(formId, options?)`

FormBackup 인스턴스를 생성합니다.

**매개변수:**

- `formId` (string): 폼의 고유 식별자
- `options` (object, 선택):
  - `exclude` (string[]): 백업에서 제외할 필드명 배열
  - `ttl` (number): 데이터 유효 시간 (밀리초)
  - `storage` ('local' | 'session'): 저장소 타입 (기본값: 'session')

**반환값:** FormBackup 인스턴스

### `backup.save(data)`

폼 데이터를 저장합니다.

**매개변수:**

- `data` (object): 저장할 폼 데이터

**반환값:** boolean - 성공 여부

### `backup.restore()`

저장된 폼 데이터를 복원합니다. TTL이 만료된 경우 null을 반환합니다.

**반환값:** object | null - 복원된 데이터 또는 null

### `backup.clear()`

저장된 폼 데이터를 삭제합니다.

**반환값:** boolean - 성공 여부

### `backup.exists()`

저장된 데이터가 존재하는지 확인합니다.

**반환값:** boolean - 존재 여부

### `backup.getRemainingTTL()`

남은 TTL을 밀리초 단위로 반환합니다.

**반환값:** number | null - 남은 시간(ms) 또는 null

## React 예제

```tsx
import React, { useState, useEffect } from 'react';
import { createFormBackup } from 'form-backup';

const backup = createFormBackup('contact-form', {
  exclude: ['password'],
  ttl: 10 * 60 * 1000, // 10분
  storage: 'local',
});

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isCheckedRestore, setIsCheckedRestore] = useState(false);

  // 컴포넌트 마운트 시 데이터 복원
  useEffect(() => {
    const saved = backup.restore();
    if (saved) {
      setFormData(saved as typeof formData);
    }

    setIsCheckedRestore(true);
  }, []);

  // 폼 데이터 변경 시 자동 저장
  useEffect(() => {
    if (!isCheckedRestore) {
      return;
    }

    backup.save(formData);
  }, [formData, isCheckedRestore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출 처리
    console.log('제출:', formData);
    backup.clear(); // 제출 후 백업 삭제
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="이름"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="이메일"
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="메시지"
      />
      <button type="submit">전송</button>
    </form>
  );
}
```

## 라이선스

MIT © agetbase. 자세한 내용은 [LICENSE](./LICENSE)를 참조하세요.
