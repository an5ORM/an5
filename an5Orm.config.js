/**
 * an5 ORM Configuration
 * 
 * This file configures the schema generator and database push/pull operations.
 * Place this file in the root of your project (same level as package.json).
 */

module.exports = {
  /**
   * Database connection for db:push, db:pull, db:migrate:* and db:cleanup.
   *
   * DATABASE_URL overrides this when set, so a committed config can point at a
   * development database while CI supplies its own. Leave it out rather than
   * committing a password — keep secrets in the environment.
   *
   * connectionString: 'sqlserver://localhost:1433;database=mydb;user=sa;password=...',
   */

  /**
   * Schema directory path (relative to this file)
   * Default: 'an5Schema'
   */
  schemaDir: 'an5Schema',

  /**
   * Output configuration for generated code
   */
  outputs: {
    /**
     * TypeScript output configuration
     *
     * Both keys are required strings. An unknown key here is an error rather
     * than a silent fallback, so a typo cannot quietly send the client
     * somewhere else.
     */
    typescript: {
      /** Output directory for generated TypeScript files */
      outputDir: 'an5Client/typescript',

      /** Path for the generated metadata module */
      metadataFile: 'an5Client/typescript/an5Metadata.ts',
    },

    /**
     * Python output configuration
     */
    python: {
      /** Path for Python metadata file */
      metadataFile: 'an5Client/python/an5_metadata.py',
    },

    /**
     * .NET output configuration
     */
    dotnet: {
      /** Output directory for generated .NET files */
      outputDir: 'an5Client/dotnet',
    },

    /**
     * Golang output configuration
     */
    golang: {
      /** Output directory for generated Golang files */
      outputDir: 'an5Client/golang',
    },

    /**
     * Rust output configuration
     */
    rust: {
      /** Output directory for generated Rust crate (Cargo.toml + src/) */
      outputDir: 'an5Client/rust',
    },
  },

  /**
   * Database pull configuration
   */
  pull: {
    /**
     * Tables to exclude from pull (regex patterns)
     * Default: ['__.*', 'sys.*', 'igrations']
     */
    exclude: [
      '^__',           // System tables
      '^sys\\.',       // SQL Server system tables
      '^igrations',    // Migration tables
    ],

    /**
     * Whether to preserve existing relations in schema files
     * Default: true
     */
    preserveRelations: true,
  },

  /**
   * Code generation options
   */
  generation: {
    /**
     * Whether to write the generated metadata module.
     * Default: true
     */
    generateMetadata: true,
  },
};
