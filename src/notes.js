import { getDB, insertDB, saveDB } from "./db.js";

const NOTES = 'notes';
export const newNote = async (note, tags) => {
  const toAddNote = {
    id: Date.now(),
    content: note,
    tags
  }

  await insertDB(NOTES, toAddNote);
  return toAddNote;
}

export const getAllNotes = async () => {
  const db = await getDB();

  return db[NOTES];
}

export const findNotes = async (texts) => {
  const notes = await getAllNotes();

  return notes.filter((note) => note.content.toLowerCase().includes(texts.toLowerCase()));
}

export const removeNote = async (id) => {
  const db = await getDB();
  const notes = db[NOTES];

  const newNotes = notes.filter((note) => note.id !== id);
  const newDB = {
    ...db,
    [NOTES]: newNotes,
  }
  await saveDB(newDB);

  return id;
}

export const removeAllNotes = async () => {
  const db = await getDB();

  await saveDB({
    ...db,
    notes: []
  });

  return true;
}