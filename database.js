import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('rpie_specification.db');


// Create the Users table
db.transaction((tx) => {
  tx.executeSql(
    'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT);',
    [],
    () => console.log('User table created'),
    (error) => console.error('Error creating user table:', error)
  );
});

export function insertUser(email, password) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO Users (email, password) VALUES (?, ?);',
        [email, password],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve('User inserted successfully');
          } else {
            reject('User insertion failed');
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

export function loginUser(email, password) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Users WHERE email = ? AND password = ?;',
        [email, password],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve('Login successful');
          } else {
            reject('Invalid email or password');
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}