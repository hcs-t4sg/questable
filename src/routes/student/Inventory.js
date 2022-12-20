import React, { useState, useEffect, useContext, useReducer } from "react"
import { doc, collection, collectionGroup, onSnapshot, query, whereEqualTo, where } from "firebase/firestore";

import Grid from '@mui/material/Grid';
import Layout from '../../components/Layout.js';
import ShopItemCard from "../../components/ShopItemCard.js";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { db } from '../../utils/firebase';
// import ReactDOM from "react-dom"
import Spritesheet from "react-responsive-spritesheet"
import { Box, ThemeProvider, createTheme, zIndex } from '@mui/system';
// import Player from "./Player"
// import avatar from '../../utils/spriteSheets/current/char4.png'
// import overalls from '../../utils/spriteSheets/current/overalls.png'
// import braids from '../../utils/spriteSheets/current/braids.png'
import Avatar from '../../components/Avatar';
import InventoryItemCard from "../../components/InventoryItemCard.js";
import { getBodyItems, getHairItems, getShirtItems, getPantsItems, getShoesItems } from '../../utils/items';


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
          <Typography component="span">{children}</Typography>
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


const bodies = getBodyItems()
// const hairs = getHairItems()
// const shirts = getShirtItems()
// const pants = getPantsItems()
// const shoes = getShoesItems()

export default function Inventory({playerID, classID}) {
  const [value, setValue] = React.useState(0);
  const [inventoryItems, setInventoryItems] = React.useState([]);

  // Listens for changes in the inventory items 
  useEffect(() => {
    const q = query(collection(db, `classrooms/${classID}/players/${playerID}/inventory`))
    // const pants = query(collection(db, `classrooms/${classID}/players/${playerID}/inventory`), where("type", "==", "pants"))
    // const shoes = query(collection(db, `classrooms/${classID}/players/${playerID}/inventory`) , where("type", "==", "shoes"))
    // const hair = query(collection(db, `classrooms/${classID}/players/${playerID}/inventory`), where("type", "==", "hair"))
    // const shirts = query(collection(db, `classrooms/${classID}/players/${playerID}/inventory`), where("type", "==", "shirts"))


    // const q = query(collection(db, "classrooms"), where("players", "==", player?.uid), and("players.inventory.type", 
    // "==", "shirt"));
    // const q = query(collectionGroup(db, "inventory"), whereEqualTo("player", player?.uid))

    onSnapshot(q, (snapshot) => {
       const inventoryList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
       setInventoryItems(inventoryList);
    })
 }, [playerID, classID])


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

   return (
   <Layout>
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="All" {...a11yProps(0)} />
                <Tab label="Bodies" {...a11yProps(1)} />
                <Tab label="Hair" {...a11yProps(2)} />
                <Tab label="Shirts" {...a11yProps(3)} />
                <Tab label="Pants" {...a11yProps(4)} />
                <Tab label="Shoes" {...a11yProps(5)} /> 
            </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
            {inventoryItems.map((item) => (
               <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <InventoryItemCard item={item}/>
               </Grid>
            ))}
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {Array.from(bodies).map((item, index) => (
                <Grid item xs={2} sm={3} md={3} key={index}>
                  <InventoryItemCard item={item}/>
                </Grid>
              ))}
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={2}>
            {inventoryItems.map((item) => {
              if (item.type === "hair"){
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <InventoryItemCard item={item}/>
                  </Grid>
                )}
              else {
                return "" 
              }
            }
            )}
        </TabPanel>

        <TabPanel value={value} index={3}>
            {inventoryItems.map((item) => {
              if (item.type === "shirts"){
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <InventoryItemCard item={item}/>
                  </Grid>
                )}
              else {
                return "" 
              }
            }
            )}
        </TabPanel>

        <TabPanel value={value} index={2}>
            {inventoryItems.map((item) => {
              if (item.type === "pants"){
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <InventoryItemCard item={item}/>
                  </Grid>
                )}
              else {
                return "" 
              }
            }
            )}
        </TabPanel>

        <TabPanel value={value} index={2}>
            {inventoryItems.map((item) => {
              if (item.type === "shoes"){
                return (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <InventoryItemCard item={item}/>
                  </Grid>
                )}
              else {
                return "" 
              }
            }
            )}
        </TabPanel>
        
    </Layout>
  )
}





// 1) Given an id for a particular item 
// 2) Go to the correct location on the spritesheet
// Display the item on the inventory page.



// We'll have a final json file that maps the player items to the correct sprite item. 

