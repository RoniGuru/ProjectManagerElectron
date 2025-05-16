import { Database } from '../../db/database';
import * as path from 'path';
import { app } from 'electron';
import sqlite3 from 'sqlite3';

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn(() => '/mock/user/data/path'),
  },
}));

// Mock sqlite3 to use in-memory database for testing
jest.mock('sqlite3', () => {
  const actualSqlite3 = jest.requireActual('sqlite3');
  return {
    ...actualSqlite3,
    Database: jest.fn().mockImplementation((path, callback) => {
      // Use in-memory database for testing
      return new actualSqlite3.Database(':memory:', callback);
    }),
  };
});

describe('Database', () => {
  let db: Database;
  let mockDbPath: string;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create a new database instance
    db = new Database();

    // Get the mock path that would be used
    mockDbPath = path.join('/mock/user/data/path', 'database.sqlite');
  });

  afterEach(() => {
    db.close();
  });

  test('should initialize database on creation', () => {
    // Verify that the database was opened with the correct path
    expect(sqlite3.Database).toHaveBeenCalledWith(
      mockDbPath,
      expect.any(Function)
    );
  });

  // Add more tests for your specific methods
});
