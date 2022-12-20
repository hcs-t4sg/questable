import React, { useState, useEffect} from "react"
import { doc, collection, collectionGroup, onSnapshot, query, whereEqualTo, where } from "firebase/firestore";
import Grid from '@mui/material/Grid';
import Layout from '../../components/Layout.js';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { db } from '../../utils/firebase';
// import ReactDOM from "react-dom"
import { Box } from '@mui/system';
import InventoryItemCard from "../../components/InventoryItemCard.js";
import { getBodyItems, getShirtItems, Body, Hair, Shirt, Pants, Shoes } from '../../utils/items';

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

export default function Inventory({player, classroom}) {
  const [value, setValue] = React.useState(0);
  const [inventoryItems, setInventoryItems] = React.useState([]);

  // Listens for changes in the inventory items 
  useEffect(() => {
    const q = query(collection(db, `classrooms/${classroom.id}/players/${player.id}/inventory`));

    onSnapshot(q, (snapshot) => {
       const inventoryList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
       setInventoryItems(inventoryList);
    })
 }, [player, classroom])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  let inventoryObjects = [];

  console.log(inventoryItems);

  inventoryItems.forEach((item) => {
    if (item.type === "hair") {
      inventoryObjects.push(new Hair(item.item_id, item.subtype));
    } else if (item.type === "shirt") {
      inventoryObjects.push(new Shirt(item.item_id));
    } else if (item.type === "pants") {
      inventoryObjects.push(new Pants(item.item_id));
    } else if (item.type === "shoes") {
      inventoryObjects.push(new Shoes(item.item_id));
    }
  });

  console.log(inventoryObjects);
  console.log(getBodyItems());

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
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

            {inventoryObjects.map((item, index) => (
               <Grid item xs={12} sm={6} md={4} key={index}>
                  <InventoryItemCard item={item} player={player} classroom={classroom}/>
               </Grid>
            ))}
        </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {getBodyItems().map((item, index) => (
                <Grid item xs={2} sm={3} md={3} key={index}>
                  <InventoryItemCard item={item} player={player} classroom={classroom}/>
                </Grid>
              ))}
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={2}>
            {inventoryObjects.filter(item => item.type === "hair").map((item, index) => 
              <Grid item xs={12} sm={6} md={4} key={index}>
                <InventoryItemCard item={item} player={player} classroom={classroom}/>
              </Grid>
            )}
        </TabPanel>

        <TabPanel value={value} index={3}>
            {inventoryObjects.filter(item => item.type === "shirt").map((item, index) => 
              <Grid item xs={12} sm={6} md={4} key={index}>
                <InventoryItemCard item={item} player={player} classroom={classroom}/>
              </Grid>
            )}
        </TabPanel>

        <TabPanel value={value} index={4}>
            {inventoryObjects.filter(item => item.type === "pants").map((item, index) => 
            <Grid item xs={12} sm={6} md={4} key={index}>
              <InventoryItemCard item={item} player={player} classroom={classroom}/>
            </Grid>
            )}
        </TabPanel>

        <TabPanel value={value} index={5}>
          {inventoryObjects.filter(item => item.type === "shoes").map((item, index) => 
              <Grid item xs={12} sm={6} md={4} key={index}>
                <InventoryItemCard item={item} player={player} classroom={classroom}/>
              </Grid>
            )}
        </TabPanel>
        
    </Layout>
  )
}





// 1) Given an id for a particular item 
// 2) Go to the correct location on the spritesheet
// Display the item on the inventory page.



// We'll have a final json file that maps the player items to the correct sprite item. 

