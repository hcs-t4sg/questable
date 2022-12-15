import React, { useState, useEffect, useContext, useReducer } from "react"
import Grid from '@mui/material/Grid';
import Layout from '../../components/Layout.js';
import ClassroomCard from "../../components/ClassroomCard";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
// import ReactDOM from "react-dom"
import Spritesheet from "react-responsive-spritesheet"
import { Box, ThemeProvider, createTheme, zIndex} from '@mui/system';
// import Player from "./Player"
// import avatar from '../../utils/spriteSheets/current/char4.png'
// import overalls from '../../utils/spriteSheets/current/overalls.png'
// import braids from '../../utils/spriteSheets/current/braids.png'




// export default function Inventory() {
//     return (

//     <Box sx={{width: '10%'}}>
//             <Spritesheet
//                 style = {{
//                     imageRendering: 'pixelated',
//                     position : 'absolute',
//                     width : '50%'
//                 }}
//                 image={avatar}
//                 widthFrame={32}
//                 heightFrame={32}
//                 // steps={1}
//                 fps={10}
//                 loop={false}
//                 startAt={1}
//                 endAt={1}
//                 isResponsive={true}
//                 />
      
//             <Spritesheet
//                 style = {{
//                     imageRendering: 'pixelated',
//                     position: 'absolute',
//                     width: '50%'
//                 }}
//                 image={overalls}
//                 widthFrame={32}
//                 heightFrame={32}
//                 steps={1}
//                 fps={10}
//                 loop={true}
//                 startAt={1}
//                 endAt={1}
//                 isResponsive={true}
//                 />
       
           
//             <Spritesheet
//                 style = {{
//                     imageRendering: 'pixelated',
//                     position: 'absolute',
//                     width: '50%'
//                 }}
//                 image={braids}
//                 widthFrame={32}
//                 heightFrame={32}
//                 steps={1}
//                 fps={10}
//                 loop={true}
//                 startAt={0}
//                 endAt={10}
//                 isResponsive={true}
//             />    
       
//     </Box>
//       )
//  }


function TabPanel(props) {
   const { children, value, index, ...other } = props;
 
   return (
     <div
       role="tabpanel"
       hidden={value !== index}
       id={`simple-tabpanel-${index}`}
       aria-labelledby={`simple-tab-${index}`}
       {...other}
     >
       {value === index && (
         <Box sx={{ p: 3 }}>
           <Typography>{children}</Typography>
         </Box>
       )}
     </div>
   );
 }

 TabPanel.propTypes = {
   children: PropTypes.node,
   index: PropTypes.number.isRequired,
   value: PropTypes.number.isRequired,
 };

 function a11yProps(index) {
   return {
     id: `simple-tab-${index}`,
     'aria-controls': `simple-tabpanel-${index}`,
   };
 }

export default function Inventory() {
   const [value, setValue] = React.useState(0);

   const handleChange = (event, newValue) => {
      setValue(newValue);
   };

   return (
   <Layout>
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="All" {...a11yProps(0)} />
                <Tab label="Avatars" {...a11yProps(1)} />
                <Tab label="Accessories" {...a11yProps(2)} />
                <Tab label="Custom Gifts" {...a11yProps(3)} />
            </Tabs>
        </Box>
       
        <TabPanel value={value} index={0}> Item One </TabPanel>
        <TabPanel value={value} index={1}> Item Two </TabPanel>
        <TabPanel value={value} index={2}> Item Three </TabPanel>
    </Layout>
   )
}





// 1) Given an id for a particular item 
// 2) Go to the correct location on the spritesheet
// Display the item on the inventory page



// We'll have a final json file that maps the player items to the correct sprite item. 

