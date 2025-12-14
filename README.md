# form-backup &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/agetbase/form-backup/blob/main/LICENSE) [![NPM badge](https://img.shields.io/npm/v/form-backup?logo=npm)](https://www.npmjs.com/package/form-backup)

English | [한국어](https://github.com/agetbase/form-backup/blob/main/README-ko_kr.md) | [简体中文](https://github.com/agetbase/form-backup/blob/main/README-zh_hans.md) | [日本語](https://github.com/agetbase/form-backup/blob/main/README-ja_jp.md)

form-backup is a simple and convenient library for automatically saving and restoring form data in web applications.

- **Auto Backup**: Automatically saves form data to localStorage or sessionStorage
- **TTL Support**: Set expiration time for saved data
- **Field Exclusion**: Exclude sensitive fields like passwords from backup
- **TypeScript Support**: Full type definitions provided
- **Lightweight**: Pure JavaScript with no dependencies

## Installation

```bash
npm install form-backup
```

## Example

```typescript
import { createFormBackup } from 'form-backup';

// Create FormBackup instance
const backup = createFormBackup('signup-form', {
  exclude: ['password'], // Fields to exclude
  ttl: 30 * 60 * 1000, // 30 minutes (milliseconds)
  storage: 'local', // 'local' or 'session'
});

// Save form data
backup.save({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'secret123', // Included in exclude, won't be saved
  newsletter: true,
});

// Restore form data
const data = backup.restore();
if (data) {
  console.log(data);
  // { name: 'John Doe', email: 'john@example.com', newsletter: true }
}

// Check saved data
if (backup.exists()) {
  console.log('Backup data exists');
}

// Check remaining TTL
const remaining = backup.getRemainingTTL();
if (remaining) {
  console.log(`Remaining time: ${remaining}ms`);
}

// Delete saved data
backup.clear();
```

## API

### `createFormBackup(formId, options?)`

Creates a FormBackup instance.

**Parameters:**

- `formId` (string): Unique identifier for the form
- `options` (object, optional):
  - `exclude` (string[]): Array of field names to exclude from backup
  - `ttl` (number): Data validity time (milliseconds)
  - `storage` ('local' | 'session'): Storage type (default: 'session')

**Returns:** FormBackup instance

### `backup.save(data)`

Saves form data.

**Parameters:**

- `data` (object): Form data to save

**Returns:** boolean - Success status

### `backup.restore()`

Restores saved form data. Returns null if TTL has expired.

**Returns:** object | null - Restored data or null

### `backup.clear()`

Deletes saved form data.

**Returns:** boolean - Success status

### `backup.exists()`

Checks if saved data exists.

**Returns:** boolean - Whether data exists

### `backup.getRemainingTTL()`

Returns remaining TTL in milliseconds.

**Returns:** number | null - Remaining time (ms) or null

## React Example

```tsx
import React, { useState, useEffect } from 'react';
import { createFormBackup } from 'form-backup';

const backup = createFormBackup('contact-form', {
  exclude: ['password'],
  ttl: 10 * 60 * 1000, // 10 minutes
  storage: 'local',
});

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isCheckedRestore, setIsCheckedRestore] = useState(false);

  // Restore data on component mount
  useEffect(() => {
    const saved = backup.restore();
    if (saved) {
      setFormData(saved as typeof formData);
    }

    setIsCheckedRestore(true);
  }, []);

  // Auto-save on form data change
  useEffect(() => {
    if (!isCheckedRestore) {
      return;
    }

    backup.save(formData);
  }, [formData, isCheckedRestore]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submit:', formData);
    backup.clear(); // Delete backup after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
      />
      <textarea
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Message"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## License

MIT © agetbase. See [LICENSE](./LICENSE) for details.
