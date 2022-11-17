import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Layout from './Layout.js';
import { Typography, Box } from '@mui/material';
import ClassStudent from '../routes/student/ClassStudent';
import Main from '../routes/student/Main';
import Shop from '../routes/student/Shop';
import Inventory from '../routes/student/Inventory';
import placeholderAvatar from '../utils/tempAssets/oval.png'

export default function StudentView({ player, classroom }) {
   const ProgressBar = ({percentFilled}) => (
      <div 
         style={{
            width: '210px', 
            height: '20px', 
            backgroundColor: 'white', 
            borderStyle: 'solid', 
            borderWidth: '2px', 
            borderColor: '#C1C1C1',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
            marginTop: '20px'
         }}
      >
         <div
            style={{
               width: `${percentFilled}%`, 
               height: '100%', 
               backgroundColor: '#C1C1C1', 
            }}
         />
      </div>
   )

   return (
      <Layout classroom role={player?.role}>
         <Box
            sx={{
            width: '100%',
            height: '60%',
            backgroundColor: '#D9D9D9',
            borderRadius: '48px',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '30px', marginBottom: '74px',
            paddingLeft: '40px', paddingRight: '40px', paddingBottom: '72px', paddingTop: '40px',
            }}
      >
         <Typography fontWeight='bold' variant='h4'>{classroom.name}</Typography>
         <Box
            sx={{display: 'flex', alignItems: '', marginTop: '48px'}}
         >
            <Box
               component="img"
               sx={{
                  width: '30%',
                  height: '60%',
                  maxHeight: '312px',
                  maxWidth: '313px',
               }}
               alt="User's avatar"
               src={placeholderAvatar}
            />
            <Box sx={{display: 'flex', flexDirection: 'column', marginLeft: '46px'}}>
               <ProgressBar percentFilled={100} ></ProgressBar>
               <ProgressBar percentFilled={33} ></ProgressBar>
            </Box>

         </Box>

      </Box>
         <Routes>
            <Route path="/" element={<Navigate to="main" />} />
            <Route path="main" element={<Main classroom={classroom}  player={player}/>} />
            <Route path="shop" element={<Shop />} />
            <Route path="class-student" element={<ClassStudent />} />
            <Route path="inventory" element={<Inventory />} />
            <Route
               path="*"
               element={
                  <main style={{ padding: "1rem" }}>
                     <p>There's nothing here!</p>
                  </main>
               }
            />
         </Routes>
         <Outlet />
      </Layout>
   )
}