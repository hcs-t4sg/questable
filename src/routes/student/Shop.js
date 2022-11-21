<<<<<<< HEAD
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Layout from '../../components/Layout.js';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import ShopItemCard from '../../components/ShopItemCard.js';

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
      <Grid sx={{display: 'flex', flexDirection: 'column'}} container spacing={3}>
        <Grid item xs={12}>
        <h3>Shop</h3>
        <h5>Purchase avatars, accessories, and special rewards from the shop!</h5>
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
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {Array.from(Array(6)).map((_, index) => (
              <Grid item xs={2} sm={3} md={3} key={index}>
                <ShopItemCard itemType="pet" itemName="kitty" itemPrice="priceless" itemDescription="cat" />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {Array.from(Array(6)).map((_, index) => (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <p> AVATARS Placeholder</p>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {Array.from(Array(6)).map((_, index) => (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <p>ACC Placeholder</p>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {Array.from(Array(6)).map((_, index) => (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <p>CUSOTM Placeholder</p>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Grid>
    </Layout>
=======
import Grid from '@mui/material/Grid';
import Layout from '../../components/Layout.js';

export default function Shop() {
   return (
   <Layout>
         <Grid container spacing={3}>
            <Grid item xs={12}>
               <h1>Shop</h1>
            </Grid>
         </Grid>
      </Layout>
>>>>>>> 34bd9cc (basic shop.js and shopitemcard.js outlines)
   )
   
}