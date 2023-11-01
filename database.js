import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';

const db = SQLite.openDatabase('rpie_specification.db');


// Create the Users table or check if it exists
NetInfo.fetch().then((state) => {
  if (state.isConnected) {
    console.log('Device is connected to the internet');
    // Proceed with creating the Users table and inserting data from the API
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT);',
        [],
        () => {
          console.log('User table created');
          insertUsersFromAPI();
        },
        (error) => console.error('Error creating user table:', error)
      );
    });
  } else {
    console.log('Device is not connected to the internet');

    // Check if the Users table exists
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='Users';",
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            // The Users table exists
            console.log('Users table exists');
            // You can proceed with other actions here if needed
          } else {
            // The Users table does not exist
            console.error('Connect to the Internet to Get All User Data');
            console.log('Users table does not exist');
            // You can handle this case as needed
          }
        },
        (error) => console.error('Error checking for Users table:', error)
      );
    });
  }
});


// Function to fetch data from WordPress API
async function fetchUsersFromAPI() {
  
  try {
    const response = await fetch('https://valiantservices.dcodeprojects.co.in/wp-json/sections/v1/users');
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Function to insert fetched users into the local database
async function insertUsersFromAPI() {
  try {
    const users = await fetchUsersFromAPI();

    if (users && users.length > 0) {
      for (const user of users) {
        // Check if the user already exists in the local database by username
        const existingUser = await checkUserByusername(user.data.app_credentials.username);
        if (!existingUser) {
          // User doesn't exist, so insert them
          await insertUser(user.data.app_credentials.username, user.data.app_credentials.password);
          console.log(`User '${user.data.app_credentials.username}' inserted from API successfully`);
        } else {
          await updateUserPassword(user.data.app_credentials.username, user.data.app_credentials.password);
          console.log(`User '${user.data.app_credentials.username}' password updated from API successfully`);
        }
      }
    } else {
      console.log('No users fetched from the API');
    }
  } catch (error) {
    console.error('Error inserting users from API:', error);
  }
}

// Function to check if a user with a given username already exists in the local database
async function checkUserByusername(username) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Users WHERE username = ?;',
        [username],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0)); // Resolve with the user if found
          } else {
            resolve(null); // Resolve with null if user not found
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

export function insertUser(username, password) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO Users (username, password) VALUES (?, ?);',
        [username, password],
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

export function updateUserPassword(username, newPassword) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE Users SET password = ? WHERE username = ?;',
        [newPassword, username],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve('Password updated successfully');
          } else {
            reject('User not found or password update failed');
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

export function loginUser(username, password) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Users WHERE username = ? AND password = ?;',
        [username, password],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve('Login successful');
          } else {
            reject('Invalid username or password');
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

export const createRpieSpecsTable = () => {
  db.transaction((tx) => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS rpie_specifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rpie_id TEXT,
        created_date TEXT,
        status TEXT
      )
    `);
  });
};