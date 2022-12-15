import * as React from 'react';
import Grid from '@mui/material/Grid';
import Layout from '../../components/Layout.js';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

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

export default function Shop() {

   const [value, setValue] = React.useState(0);

   const handleChange = (event, newValue) => {
      setValue(newValue);
   };

   return (
   <Layout>
         <Grid container spacing={3}>
            <Grid item xs={12}>
            <h3>Shop!</h3>
            <h5>Purchase avators, accessories, and special rewards from the shop!</h5>
            </Grid>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
               <Tab label="All" {...a11yProps(0)} />
               <Tab label="Avatars" {...a11yProps(1)} />
               <Tab label="Accessories" {...a11yProps(2)} />
               <Tab label="Custom Gifts" {...a11yProps(3)} />
            </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
            One
            </TabPanel>
            <TabPanel value={value} index={1}>
            Two
            </TabPanel>
            <TabPanel value={value} index={2}>
            Three
            </TabPanel>
            <TabPanel value={value} index={3}>
            Four
            </TabPanel>
         </Grid>
      </Layout>
   )
   
}