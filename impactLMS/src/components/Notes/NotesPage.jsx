import React, { useEffect, useState } from "react";
import "./NotesPage.css";

function NotesPage() {
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!note.trim()) return;

    const newNote = {
      id: Date.now(),
      text: note,
      date: new Date().toLocaleString(),
    };

    setNotes([newNote, ...notes]);
    setNote("");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const filteredNotes = notes.filter((n) =>
    n.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="notes-container">

      <div className="notes-header">
        <h1>📚 My Study Notes</h1>
        <p>Store your learning notes locally</p>
      </div>

      <div className="notes-form">
        <textarea
          placeholder="Write your notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button onClick={addNote}>
          Add Note
        </button>
      </div>

      <input
        className="search-box"
        type="text"
        placeholder="Search Notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="notes-grid">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((item) => (
            <div className="note-card" key={item.id}>
              <p>{item.text}</p>

              <div className="note-footer">
                <span>{item.date}</span>

                <button
                  onClick={() => deleteNote(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-note">
            No Notes Found
          </div>
        )}
      </div>

    </div>
  );
}

export default NotesPage;