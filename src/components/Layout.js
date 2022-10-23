import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from "react";
import ClassroomSidebar from './ClassroomSidebar';

export default function Layout({ children, classroom, role }) {
   return (
      <Box sx={{
         display: 'flex',
      }}>
         {classroom && <ClassroomSidebar role={role} />}
         <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
         </Container>
      </Box>
   )
}