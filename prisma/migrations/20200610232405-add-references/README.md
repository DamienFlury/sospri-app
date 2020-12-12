# Migration `20200610232405-add-references`

This migration has been generated by Damien Flury at 6/10/2020, 11:24:05 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."Message" ADD COLUMN "userId" integer  NOT NULL ;

ALTER TABLE "public"."Message" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200610231117-init..20200610232405-add-references
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
@@ -20,5 +20,7 @@
 model Message {
   id Int @default(autoincrement()) @id
   text String
+  user User @relation(fields: [userId], references: [id])
+  userId Int
 }
```

