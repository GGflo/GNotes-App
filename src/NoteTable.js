import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete"; // Import the delete icon

const NoteTable = ({ notes, selectedNote, onNoteSelect, onDeleteNote, onToggleChange }) => {
    const [activeButton, setActiveButton] = useState('button1'); // Initialize activeButton state

    const handleNoteSelect = (note) => {
        onNoteSelect(note);
    };

    const handleDeleteNote = (note) => {
        onDeleteNote(note);
    };

    const handleToggleChange = (button) => {
        if (activeButton === button) {
            setActiveButton(null);
            onToggleChange(null);
        } else {
            setActiveButton(button);
            onToggleChange(button);
        }
    };

    return (
        <div className="note-table-container">
            <TableContainer component={Paper} className="note-table">
                {/* Table Header */}
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ whiteSpace: 'nowrap',width:'170px'}}>Notes:</TableCell>
                            <TableCell>
                                <button style={{float:'right'}}
                                    id="note-buttontoggle"
                                    name="toggles"
                                    className={activeButton === 'button1' ? 'active' : ''}
                                    onClick={() => handleToggleChange('button1')}
                                >
                                    Private
                                </button>
                            </TableCell>
                            <TableCell>
                                <button style={{float:'right'}}
                                    id="note-buttontoggle"
                                    name="toggles"
                                    className={activeButton === 'button2' ? 'active' : ''}
                                    onClick={() => handleToggleChange('button2')}
                                >
                                    Public
                                </button>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    {/* Table Body */}
                    <TableBody>
                        {notes.map((note) => (
                            <TableRow
                                key={note.id}
                                onClick={() => handleNoteSelect(note)}
                                className={selectedNote === note ? "selected" : ""}
                            >
                                <TableCell style={{ whiteSpace: 'nowrap',maxWidth:'140px'}}>{note.title}   </TableCell>
                                <TableCell><span style={{float:'right'}}> {new Date(note.id).toString().substr(4, 20)}</span></TableCell>
                                <TableCell style={{maxWidth:'80px'}}>

                                    <IconButton style={{float:'right'}}
                                        color="secondary"
                                        onClick={() => handleDeleteNote(note)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

NoteTable.propTypes = {
    notes: PropTypes.array.isRequired,
    selectedNote: PropTypes.object,
    onNoteSelect: PropTypes.func.isRequired,
    onDeleteNote: PropTypes.func.isRequired,
};

export default NoteTable;
