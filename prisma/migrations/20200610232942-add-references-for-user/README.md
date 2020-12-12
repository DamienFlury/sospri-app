# Migration `20200610232942-add-references-for-user`

This migration has been generated by Damien Flury at 6/10/2020, 11:29:42 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200610232405-add-references..20200610232942-add-references-for-user
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
 generator client {
   provider = "prisma-client-js"
@@ -15,8 +15,9 @@
   firstName String
   lastName String
   userName String
   password String
+  messages Message[]
 }
 model Message {
   id Int @default(autoincrement()) @id
```

