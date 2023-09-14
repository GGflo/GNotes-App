// src/ContentContainer.js

import React from 'react';
import Container from '@mui/material/Container';

const ContentContainer = ({ children }) => {
    return (
        <Container maxWidth="md">
            {children}
        </Container>
    );
};

export default ContentContainer;
