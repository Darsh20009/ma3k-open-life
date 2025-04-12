
import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@0.0.0.0:5432/postgres",
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

// فحص الاتصال
pool.connect()
  .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
  .catch(err => console.error('خطأ في الاتصال بقاعدة البيانات:', err));
