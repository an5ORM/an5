export type DatabaseType = 'mssql' | 'postgresql';

export function detectDbType(connectionString?: string): DatabaseType {
  if (!connectionString) {
    connectionString = process.env.DATABASE_URL || '';
  }
  const str = connectionString.toLowerCase();
  if (str.startsWith('postgresql://') || str.startsWith('postgres://')) {
    return 'postgresql';
  }
  if (str.startsWith('sqlserver://')) {
    return 'mssql';
  }
  return process.env.DB_PROVIDER === 'postgresql' ? 'postgresql' : 'mssql';
}

export function isPostgres(connectionString?: string): boolean {
  return detectDbType(connectionString) === 'postgresql';
}

export function isMssql(connectionString?: string): boolean {
  return detectDbType(connectionString) === 'mssql';
}
