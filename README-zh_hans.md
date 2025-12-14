# form-backup &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/agetbase/form-backup/blob/main/LICENSE) [![NPM badge](https://img.shields.io/npm/v/form-backup?logo=npm)](https://www.npmjs.com/package/form-backup)

[English](https://github.com/agetbase/form-backup/blob/main/README.md) | [한국어](https://github.com/agetbase/form-backup/blob/main/README-ko_kr.md) | 简体中文 | [日本語](https://github.com/agetbase/form-backup/blob/main/README-ja_jp.md)

form-backup 是一个简洁易用的库，可在 Web 应用程序中自动保存和恢复表单数据。

- **自动备份**: 自动将表单数据保存到 localStorage 或 sessionStorage
- **TTL 支持**: 可以为保存的数据设置过期时间
- **字段排除**: 可以从备份中排除密码等敏感字段
- **TypeScript 支持**: 提供完整的类型定义
- **轻量**: 无依赖的纯 JavaScript

## 安装

```bash
npm install form-backup
```

## 示例

```typescript
import { createFormBackup } from 'form-backup';

// 创建 FormBackup 实例
const backup = createFormBackup('signup-form', {
  exclude: ['password'], // 要排除的字段
  ttl: 30 * 60 * 1000, // 30 分钟（毫秒）
  storage: 'local', // 'local' 或 'session'
});

// 保存表单数据
backup.save({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secret123', // 包含在 exclude 中，不会被保存
  newsletter: true,
});

// 恢复表单数据
const data = backup.restore();
if (data) {
  console.log(data);
  // { name: 'John Doe', email: 'john@example.com', newsletter: true }
}

// 检查保存的数据
if (backup.exists()) {
  console.log('备份数据存在');
}

// 检查剩余的 TTL
const remaining = backup.getRemainingTTL();
if (remaining) {
  console.log(`剩余时间: ${remaining}ms`);
}

// 删除保存的数据
backup.clear();
```

## API

### `createFormBackup(formId, options?)`

创建 FormBackup 实例。

**参数:**

- `formId` (string): 表单的唯一标识符
- `options` (object, 可选):
  - `exclude` (string[]): 要从备份中排除的字段名数组
  - `ttl` (number): 数据的有效时间（毫秒）
  - `storage` ('local' | 'session'): 存储类型（默认: 'session'）

**返回值:** FormBackup 实例

### `backup.save(data)`

保存表单数据。

**参数:**

- `data` (object): 要保存的表单数据

**返回值:** boolean - 是否成功

### `backup.restore()`

恢复保存的表单数据。如果 TTL 已过期，则返回 null。

**返回值:** object | null - 恢复的数据或 null

### `backup.clear()`

删除保存的表单数据。

**返回值:** boolean - 是否成功

### `backup.exists()`

检查保存的数据是否存在。

**返回值:** boolean - 是否存在

### `backup.getRemainingTTL()`

以毫秒为单位返回剩余的 TTL。

**返回值:** number | null - 剩余时间（ms）或 null

## React 示例

```tsx
import React, { useState, useEffect } from 'react';
import { createFormBackup } from 'form-backup';

const backup = createFormBackup('contact-form', {
  exclude: ['password'],
  ttl: 10 * 60 * 1000, // 10 分钟
  storage: 'local',
});

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isCheckedRestore, setIsCheckedRestore] = useState(false);

  // 组件挂载时恢复数据
  useEffect(() => {
    const saved = backup.restore();
    if (saved) {
      setFormData(saved as typeof formData);
    }

    setIsCheckedRestore(true);
  }, []);

  // 表单数据更改时自动保存
  useEffect(() => {
    if (!isCheckedRestore) {
      return;
    }

    backup.save(formData);
  }, [formData, isCheckedRestore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 表单提交处理
    console.log('提交:', formData);
    backup.clear(); // 提交后删除备份
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="姓名"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="邮箱"
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="消息"
      />
      <button type="submit">提交</button>
    </form>
  );
}
```

## 许可证

MIT © agetbase. 详细信息请参阅 [LICENSE](./LICENSE)。
