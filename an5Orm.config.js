/**
 * an5 ORM Configuration
 * 
 * This file configures the schema generator and database push/pull operations.
 * Place this file in the root of your project (same level as package.json).
 */

module.exports = {
  /**
   * Schema directory path (relative to project root)
   * Default: 'an5Schema'
   */
  schemaDir: 'an5Schema',

  /**
   * Output configuration for generated code
   */
  outputs: {
    /**
     * TypeScript output configuration
     */
    typescript: {
      /** Output directory for generated TypeScript files */
      outputDir: 'an5Client/typescript',
      
      /** Path for metadata file */
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
  },

  /**
   * Database push configuration
   */
  push: {
    /** 
     * Whether to drop columns that exist in database but not in schema
     * Default: false (safer)
     */
    dropColumns: false,

    /**
     * Whether to drop tables that exist in database but not in schema
     * Default: false (safer)
     */
    dropTables: false,
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
     * Whether to generate JSDoc comments
     * Default: true
     */
    generateComments: true,

    /**
     * Whether to generate metadata files
     * Default: true
     */
    generateMetadata: true,
  },
};
