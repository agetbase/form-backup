# form-backup &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/agetbase/form-backup/blob/main/LICENSE) [![NPM badge](https://img.shields.io/npm/v/form-backup?logo=npm)](https://www.npmjs.com/package/form-backup)

[English](https://github.com/agetbase/form-backup/blob/main/README.md) | [한국어](https://github.com/agetbase/form-backup/blob/main/README-ko_kr.md) | [简体中文](https://github.com/agetbase/form-backup/blob/main/README-zh_hans.md) | 日本語

form-backup は、Web アプリケーションにおいてフォームデータを自動的に保存および復元できる、シンプルで使いやすいライブラリです。

- **自動バックアップ**: フォームデータを localStorage または sessionStorage に自動保存
- **TTL サポート**: 保存されたデータに有効期限を設定可能
- **フィールド除外**: パスワードなどの機密フィールドをバックアップから除外
- **TypeScript サポート**: 完全な型定義を提供
- **軽量**: 依存関係のない純粋な JavaScript

## インストール

```bash
npm install form-backup
```

## 例

```typescript
import { createFormBackup } from 'form-backup';

// FormBackup インスタンスを作成
const backup = createFormBackup('signup-form', {
  exclude: ['password'], // 除外するフィールド
  ttl: 30 * 60 * 1000, // 30 分（ミリ秒）
  storage: 'local', // 'local' または 'session'
});

// フォームデータを保存
backup.save({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secret123', // exclude に含まれているため保存されません
  newsletter: true,
});

// フォームデータを復元
const data = backup.restore();
if (data) {
  console.log(data);
  // { name: 'John Doe', email: 'john@example.com', newsletter: true }
}

// 保存されたデータの確認
if (backup.exists()) {
  console.log('バックアップデータが存在します');
}

// 残りの TTL を確認
const remaining = backup.getRemainingTTL();
if (remaining) {
  console.log(`残り時間: ${remaining}ms`);
}

// 保存されたデータを削除
backup.clear();
```

## API

### `createFormBackup(formId, options?)`

FormBackup インスタンスを作成します。

**パラメータ:**

- `formId` (string): フォームの一意の識別子
- `options` (object, オプション):
  - `exclude` (string[]): バックアップから除外するフィールド名の配列
  - `ttl` (number): データの有効時間（ミリ秒）
  - `storage` ('local' | 'session'): ストレージタイプ（デフォルト: 'session'）

**戻り値:** FormBackup インスタンス

### `backup.save(data)`

フォームデータを保存します。

**パラメータ:**

- `data` (object): 保存するフォームデータ

**戻り値:** boolean - 成功したかどうか

### `backup.restore()`

保存されたフォームデータを復元します。TTL が期限切れの場合、null を返します。

**戻り値:** object | null - 復元されたデータまたは null

### `backup.clear()`

保存されたフォームデータを削除します。

**戻り値:** boolean - 成功したかどうか

### `backup.exists()`

保存されたデータが存在するかどうかを確認します。

**戻り値:** boolean - 存在するかどうか

### `backup.getRemainingTTL()`

残りの TTL をミリ秒単位で返します。

**戻り値:** number | null - 残り時間（ms）または null

## React の例

```tsx
import React, { useState, useEffect } from 'react';
import { createFormBackup } from 'form-backup';

const backup = createFormBackup('contact-form', {
  exclude: ['password'],
  ttl: 10 * 60 * 1000, // 10 分
  storage: 'local',
});

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isCheckedRestore, setIsCheckedRestore] = useState(false);

  // コンポーネントのマウント時にデータを復元
  useEffect(() => {
    const saved = backup.restore();
    if (saved) {
      setFormData(saved as typeof formData);
    }

    setIsCheckedRestore(true);
  }, []);

  // フォームデータの変更時に自動保存
  useEffect(() => {
    if (!isCheckedRestore) {
      return;
    }

    backup.save(formData);
  }, [formData, isCheckedRestore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // フォーム送信の処理
    console.log('送信:', formData);
    backup.clear(); // 送信後にバックアップを削除
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="名前"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="メールアドレス"
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="メッセージ"
      />
      <button type="submit">送信</button>
    </form>
  );
}
```

## ライセンス

MIT © agetbase. 詳細は [LICENSE](./LICENSE) をご覧ください。
