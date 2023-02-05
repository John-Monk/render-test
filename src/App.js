import Note from './Note';
import { useState, useEffect } from 'react';
import noteService from './services/notes';
import Notification from './Notification';

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService
      .getAll()
      .then((response) => {
        setNotes(response.data);
    });
  }, []);

  const addNote = (e) => {
    e.preventDefault();
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
    };

    noteService
      .create(noteObject)
      .then((response) => {
        setNotes(notes.concat(response.data));
        setNewNote('');
    });
  };

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };


    // axios
    //   .put(`http://localhost:3001/notes/${id}`, changedNote)
    //   .then(res => {
    //     setNotes(notes.map(note => note.id !== id ? note: res.data))
    //   })
    //   .catch(e => {
    //     alert (
    //       `the note '${note.content}' was already deleted from the server.`
    //     )
    //     setNotes(notes.filter(n => n.id !== id))
    //   })

    noteService.update(id, changedNote).then((response) => {
      setNotes(notes.map((note) => (note.id !== id ? note : response.data)));
    })
    .catch(error => {
      setErrorMessage(
        `the note '${note.content}' was already deleted from the server.`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  };

  return (
    <div>
      <h1>Notes</h1>
      {errorMessage && <Notification message={errorMessage}/>}
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form action="" onSubmit={addNote}>
        <input type="text" onChange={handleNoteChange} value={newNote} />
        <button>save</button>
      </form>
    </div>
  );
}

export default App;
