import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Layout from './Layout.js';
import { Typography, Box } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import ClassStudent from '../routes/student/ClassStudent';
import { styled } from '@mui/material/styles';
import Main from '../routes/student/Main';
import Shop from '../routes/student/Shop';
import Inventory from '../routes/student/Inventory';
import Avatar from '../components/Avatar';
import { Body, Hair, Shirt, Pants, Shoes, getBodyItems, getHairItems, getShirtItems, getPantsItems, getShoesItems } from '../utils/items';

// import x from '../../public/static/'

export default function StudentView({ player, classroom }) {

   const ThickProgress = styled(LinearProgress)(() => ({
      height: 20,
      borderRadius: 0,
      marginTop: 50,
      [`&.${linearProgressClasses.colorPrimary}`]: {
         backgroundColor: 'rgba(102, 187, 106, .5)',
      },
      [`& .${linearProgressClasses.bar}`]: {
         borderRadius: 0,
         backgroundColor: '#1B710D',
      },
   }));

   const bodyItems = getBodyItems();
   console.log(bodyItems);

   const hairItems = getHairItems();
   console.log(hairItems);

   const shirtItems = getShirtItems();
   console.log(shirtItems);

   const pantsItems = getPantsItems();
   console.log(pantsItems);
   const shoesItems = getShoesItems();
   console.log(shoesItems);

   // Given the IDs for the outfit fetched from Firebase (and the hair subtype), you can designate the avatar outfit like so.
   const testOutfit = {
      body: new Body(2),
      shirt: new Shirt(3),
      hair: new Hair(4, 'emo'),
      pants: new Pants(5),
      shoes: new Shoes(3),
   }


   return (
      <Layout classroom role={player?.role}>
         <Box
            sx={{
               width: '100%',
               height: '60%',
               display: 'flex',
               flexDirection: 'column',
               marginTop: '30px', marginBottom: '74px',
               paddingLeft: '80px', paddingRight: '80px', paddingBottom: '72px', paddingTop: '40px',
               borderColor: 'rgba(102, 187, 106, 0.5)',
               borderStyle: 'solid',
               borderWidth: '10px'
            }}
         >
            <Typography variant='h4'>{player.name}</Typography>
            <Box
               sx={{ display: 'flex', marginTop: '20px' }}
            >
               <Box sx={{
                  width: '20%',
                  height: '40%',
                  maxHeight: '312px',
                  maxWidth: '313px',
               }}>
                  <Avatar outfit={testOutfit} />
               </Box>
               <Box sx={{ width: '350px', display: 'flex', flexDirection: 'column', marginLeft: '160px' }}>
                  <ThickProgress variant="determinate" value={30} />
                  <ThickProgress variant="determinate" value={60} />
               </Box>
               <Box sx={{ width: '350px', display: 'flex', flexDirection: 'column', marginLeft: '30px' }}>
                  <Typography sx={{ fontSize: '25px', marginTop: '38px' }}>Powerups</Typography>
                  <Typography sx={{ fontSize: '25px', marginTop: '38px' }}>Streak</Typography>
               </Box>
            </Box>
         </Box>
         <Routes>
            <Route path="/" element={<Navigate to="main" />} />
            <Route path="main" element={<Main classroom={classroom} player={player} />} />
            <Route path="shop" element={<Shop classroom={classroom} player={player} />} />
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