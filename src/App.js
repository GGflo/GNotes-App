import React, {useState, useEffect} from 'react';
import ContentContainer from './ContentContainer';
import NoteTable from './NoteTable';
import TextField from "@mui/material/TextField";
import './App.css';
import IconButton from "@mui/material/IconButton";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";


import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import Auth from "./Auth";



const config={
    apiKey: "AIzaSyCcEqpkVnL5yX-5wSsXF-MDEIVu122653c",
    authDomain: "gnotes-fda9b.firebaseapp.com",
    projectId: "gnotes-fda9b",
    storageBucket: "gnotes-fda9b.appspot.com",
    messagingSenderId: "115400093521",
    appId: "1:115400093521:web:ef7eafda398df3c86aad70",
    measurementId: "G-P7QYGLRG24"
}
firebase.initializeApp(config)
const firestore = firebase.firestore();

const privateNotesCollection = firestore.collection('privateNotes');
const publicNotesCollection = firestore.collection('publicNotes');


const initialPrivateNotes = [
    { id: 1, title: 'Private Note 1', content: 'Content of Private Note 1'},
    { id: 2, title: 'Private Note 2', content: ' ' },
];

const initialPublicNotes = [
    { id: 1, title: 'Public Note 1', content: 'Content of Public Note 1'},
    { id: 2, title: 'Public Note 2', content: 'Content of Public Note 2'},
];

function App() {
    const [selectedNote, setSelectedNote] = useState(null);
    const [privateNotes, setPrivateNotes] = useState(initialPrivateNotes);
    const [publicNotes, setPublicNotes] = useState(initialPublicNotes);
    const [activeToggle, setActiveToggle] = useState('button1');
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    const handleGoogleSignIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                console.log('Google Sign-In Successful', user);
            })
            .catch((error) => {
                console.error('Google Sign-In Error', error);
            });
    };
    const handleNoteSelect = (note) => {
        setSelectedNote(note);
    };

    const handleCreateNote = () => {
        // Create a new note based on the active toggle
        const newNote = {
            id: Date.now(),
            title: 'New Note',
            content: '',
            userId: user.uid,
        };

        if (activeToggle === 'button1') {
            privateNotesCollection.add(newNote)
                .then((docRef) => {
                    newNote.real = docRef.id;
                    setPrivateNotes([newNote, ...privateNotes]);
                    setSelectedNote(newNote);
                })
                .catch((error) => {
                    console.error('Error adding private note:', error);
                });
        } else {
            publicNotesCollection.add(newNote)
                .then((docRef) => {
                    newNote.real = docRef.id;
                    setPublicNotes([newNote, ...publicNotes]);
                    setSelectedNote(newNote);
                })
                .catch((error) => {
                    console.error('Error adding public note:', error);
                });
        }
    };

    const handleToggleChange = (button) => {
        setActiveToggle(button);
    };

    const handleDeleteNote = (noteToDelete) => {
        const collection =
            activeToggle === 'button1'
                ? privateNotesCollection
                : publicNotesCollection;

        collection
            .doc(noteToDelete.real) // Use the 'real' property as the document ID
            .delete()
            .then(() => {
                console.log('Note deleted from Firestore');
            })
            .catch((error) => {
                console.error('Error deleting note from Firestore:', error);
            });

        if (activeToggle === 'button1') {
            const updatedNotes = privateNotes.filter((note) => note.id !== noteToDelete.id);
            setPrivateNotes(updatedNotes);
        } else {
            const updatedNotes = publicNotes.filter((note) => note.id !== noteToDelete.id);
            setPublicNotes(updatedNotes);
        }
        if (selectedNote && selectedNote.id === noteToDelete.id) {
            setSelectedNote(null);
        }
    };

    const handleNoteContentChange = (event) => {
        if (selectedNote) {
            const updatedContent = event.target.value;
            console.log('New Content:', updatedContent);
            setSelectedNote((Note) => ({
                ...Note,
                content: updatedContent,
            }));

            const collection =
                activeToggle === 'button1'
                    ? privateNotesCollection
                    : publicNotesCollection
            const updatedNote = {...selectedNote, content: updatedContent};
            if (activeToggle === 'button1') {
                const updatedNotes = privateNotes.map((note) =>
                    note.id === selectedNote.id ? updatedNote : note
                );
                setPrivateNotes(updatedNotes);
            } else {
                const updatedNotes = publicNotes.map((note) =>
                    note.id === selectedNote.id ? updatedNote : note
                );
                setPublicNotes(updatedNotes);
            }
            if (selectedNote.real){
                collection
                    .doc(selectedNote.real)
                    .update({ content: updatedContent ,title:selectedNote.title})
                    .catch((error) => {
                        console.error('Error updating note:', error);
                    });

            } else {
                console.error('Selected note has no ID.');
            }
        }
    };

    const handleTitleChange = (event) => {
        if (selectedNote) {
            const updatedTitle = event.target.value;

            setSelectedNote((prevNote) => ({
                ...prevNote,
                title: updatedTitle,
            }));
        }
    };

    const handleTitleBlur = () => {
        // When the input field loses focus (blur), update the title in the notes array
        if (selectedNote) {
            if (activeToggle === 'button1') {
                const updatedNotes = privateNotes.map((note) =>
                    note.id === selectedNote.id ? selectedNote : note
                );
                setPrivateNotes(updatedNotes);
            } else {
                const updatedNotes = publicNotes.map((note) =>
                    note.id === selectedNote.id ? selectedNote : note
                );
                setPublicNotes(updatedNotes);
            }
        }
    };

    const handleTextAlignment = (alignment) => {
        if (selectedNote) {
            const updatedNote = { ...selectedNote, textAlignment: alignment };
            setSelectedNote(updatedNote);

            if (activeToggle === 'button1') {
                const updatedNotes = privateNotes.map((note) =>
                    note.id === selectedNote.id ? updatedNote : note
                );
                setPrivateNotes(updatedNotes);
            } else {
                const updatedNotes = publicNotes.map((note) =>
                    note.id === selectedNote.id ? updatedNote : note
                );
                setPublicNotes(updatedNotes);
            }
        }
    };

    // Listen for authentication state changes
    const [user, setUser] = useState(null);
    useEffect(() => {
        firebase.auth().onAuthStateChanged((authUser) => {
            if (authUser) {
                setUser(authUser);
                setIsAuthenticated(true);
                console.log('User UID:', authUser.uid);
                // Fetch user-specific private notes
                console.log('User is signed in', user);
                privateNotesCollection
                    .where('userId', '==', authUser.uid)
                    .onSnapshot((querySnapshot) => {
                        const notes = querySnapshot.docs.map((doc) => {
                            const noteData = doc.data();
                            return {
                                real: doc.id,
                                ...noteData,
                            };
                        });
                        setPrivateNotes(notes);
                    });

                publicNotesCollection
                    .onSnapshot((querySnapshot) => {
                        const notes = querySnapshot.docs.map((doc) => {
                            const noteData = doc.data();
                            return {
                                real: doc.id,
                                ...noteData,
                            };
                        });
                        setPublicNotes(notes);
                    });
            } else {
                console.log('User is signed out');
                setIsAuthenticated(false);
                setUser(null);
                setPrivateNotes([]);
                setPublicNotes([]);
                setSelectedNote(null);
            }
        })
    }, [user])

        const handleSignOut = () => {
        firebase.auth().signOut()
            .then(() => {
                // Sign-out successful
                setUser(null);
                // Clear the notes when the user signs out
                setPrivateNotes([]);
                setPublicNotes([]);
                setSelectedNote(null);
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };


    return (
        <div>
            <AppBar position="static" style={{ background: '#282c34',width:'auto' }}>
                <Toolbar >
                    <img src="https://media.istockphoto.com/id/1306132242/vector/g-letter-white-letter-g-with-arrow-delivery-or-logistic-icon.jpg?s=612x612&w=0&k=20&c=thF39qaXi4ebRa06FA8b1IyZ1wnbwEI7FJdZKctvFDM=" alt="Logo" style={{ marginRight: '6px', maxWidth:'40px' }} />
                    <Typography variant="h6">GNotes</Typography>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                            <p style={{ color: 'white', marginRight: '10px' }}>{user.email}</p>
                            <IconButton onClick={handleSignOut} style={{ color: 'white', border: 'none', background: 'transparent',fontSize:'20px', cursor: 'pointer' }}>
                                Sign Out
                            </IconButton>
                        </div>
                    ) : (
                        <IconButton onClick={handleGoogleSignIn} style={{ float:'right', marginLeft:'auto',position:'relative',color:'white' }}>
                            <img src="https://www.transparentpng.com/thumb/google-logo/shady-google-logo-pictures-png-free-BjH4wQ.png" style={{ width:'34px' }} alt="SignIn" />
                            Sign In
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            <div className="app-container">
                {isAuthenticated ? (
                <div className="note-container">
                    <div>
                        {activeToggle === 'button1' ? (
                            <NoteTable
                                notes={privateNotes}
                                selectedNote={selectedNote}
                                onNoteSelect={handleNoteSelect}
                                onDeleteNote={handleDeleteNote}
                                onToggleChange={handleToggleChange}
                            />
                        ) : (
                            <NoteTable
                                notes={publicNotes}
                                selectedNote={selectedNote}
                                onNoteSelect={handleNoteSelect}
                                onDeleteNote={handleDeleteNote}
                                onToggleChange={handleToggleChange}
                            />
                        )}
                        <div>
                            <button className="note-button" onClick={handleCreateNote}>Create New Note</button>
                        </div>
                    </div>


                    <ContentContainer>
                        {selectedNote ? (
                            <div className="note-content">
                                <h1 style={{}}>
                                    <input style={{ whiteSpace: 'nowrap', maxWidth: '250px' }}
                                           type="text"
                                           id="note-title-input"
                                           value={selectedNote.title}
                                           onChange={handleTitleChange}
                                           onBlur={handleTitleBlur}
                                    />
                                    <span style={{ display: 'flex', fontSize: '20px', float: 'right' }}>
                                    {new Date(selectedNote.id).toString().substr(4, 20)}
                                </span>

                                    <IconButton className="align-button"  color='secondary' onClick={() => handleTextAlignment('left')}>
                                        <FormatAlignLeftIcon />
                                    </IconButton>
                                    <IconButton className="align-button" color='secondary'  onClick={() => handleTextAlignment('center')}
                                    ><FormatAlignCenterIcon />
                                    </IconButton>
                                    <IconButton className="align-button" color='secondary' border='secondary' onClick={() => handleTextAlignment('right')}>
                                        <FormatAlignRightIcon />
                                    </IconButton>
                                    {/*<div className="font-size-picker">*/}
                                    {/*    <label>Font Size:</label>*/}
                                    {/*    <input*/}
                                    {/*        type="number"*/}
                                    {/*        value={selectedNote.fontSize}*/}
                                    {/*        onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}*/}
                                    {/*        min="10" // Set a minimum font size*/}
                                    {/*        max="36" // Set a maximum font size*/}
                                    {/*    />*/}
                                    {/*</div>*/}

                                </h1>
                                <TextField
                                    id="note-input"
                                    label={<span style={{ color: 'lightgray' }}>Write your note</span>}
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={16}
                                    value={selectedNote.content}
                                    onChange={handleNoteContentChange}
                                    inputProps={{ style: { color: 'white',fontSize: selectedNote.fontSize + 'px', textAlign: selectedNote.textAlignment || 'left' } }}
                                />
                            </div>
                        ) : (
                            <p className="note-content">
                                Select a note to view or edit its content.
                            </p>
                        )}
                    </ContentContainer>
                </div>
                ) : (
                    <Auth />
                    )}
            </div>
        </div>
    );
}

export default App;
