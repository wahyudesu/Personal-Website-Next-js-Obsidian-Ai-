install prisma dan supabase client

```typescript
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" 
  url      = env("DATABASE_URL") 
}

model UserData {
  id   Int    @id @default(autoincrement()) 
  data Json   
}

```


```typescript
// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  // Path ke file JSON
  const filePath = path.join(__dirname, 'app', 'data', 'knowledge_base.json');
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Hapus data lama (opsional)
  await prisma.userData.deleteMany();

  // Tambahkan data baru
  await prisma.userData.create({
    data: {
      data: jsonData,
    },
  });

  console.log('Database berhasil di-seed!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```

```bash
npx ts-node seed.ts
npx prisma studio
```

```json
"scripts": {
  "dev": "npm run seed && next dev",
  "seed": "ts-node prisma/seed.ts"
}

```