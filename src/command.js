import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { findNotes, getAllNotes, newNote, removeAllNotes, removeNote } from './notes.js';
import { start } from './server.js';

const listNotes = (notes) => {
  notes.forEach(({id, tags, content}, index) => {
    console.log('\n');
    console.log(`------${index + 1}------`);
    console.log('id: ', id);
    console.log('tags: ', tags.join(', '));
    console.log('note: ', content);
  });
}

yargs(hideBin(process.argv))
  .scriptName('note')
  .command('new <note>', 'Create a new note', (yrgs) => yrgs.positional('note', {
    type: 'string',
    description: 'The content of the note to create',
  }), async (argv) => {
    const tags = argv.tags ? argv.tags.split(',') : [];
    const note = await newNote(argv.note, tags);

    console.log('New note added', note);
  })
  .option('tags', {
    alias: 't',
    type: 'string',
    description: 'tags to add to the note'
  })
  .command('all', 'get all notes', () => {}, async (argv) => {
    const notes = await getAllNotes();
    listNotes(notes);
  })
  .command('find <filter>', 'get matching notes', yargs => {
    return yargs.positional('filter', {
      describe: 'The search term to filter notes by, will be applied to note.content',
      type: 'string'
    })
  }, async (argv) => {
    const notes = await findNotes(argv.filter);
    listNotes(notes);
  })
  .command('remove <id>', 'remove a note by id', yargs => {
    return yargs.positional('id', {
      type: 'number',
      description: 'The id of the note you want to remove'
    })
  }, async (argv) => {
    await removeNote(argv.id);
    console.log('Removed ', argv.id);
  })
  .command('web [port]', 'launch website to see notes', yargs => {
    return yargs
      .positional('port', {
        describe: 'port to bind on',
        default: 5000,
        type: 'number'
      })
  }, async (argv) => {
    const notes = await getAllNotes();
    start(notes, argv.port);
  })
  .command('clean', 'remove all notes', () => {}, async () => {
    await removeAllNotes();
    console.log('Removed all notes!');
  })
  .demandCommand(1) 
  .parse()