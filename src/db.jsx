import * as SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const db = SQLite.openDatabase({ name: 'kcal.db', location: 'default'});

export default db;