import fs from 'node:fs/promises';

const DB_PATH = new URL('../db.json', import.meta.url);
export const getDB = async () => {
  const db = await fs.readFile(DB_PATH, { encoding: 'utf8' });
  
  return JSON.parse(db);
}

export const saveDB = async (db) => {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 3));
  return true;
}

export const insertDB = async (key, objectValue) => {
  const db = await getDB();
  db[key].push(objectValue);
  await saveDB(db);
  return true;
}