import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box'
import { purchaseItem } from '../utils/mutations';
import { useState } from 'react';
import { capitalize } from 'lodash';

export default function ShopItemCard({ item, itemPrice, classID, playerID }) {
   const [text, setText] = useState('')
   const handlePurchase = async () => {
      const res = await purchaseItem(classID, playerID, item) || null
      console.log(res)
      // if (res === 'Not enough money!'){
      //    setErr("Not enough money!")
      // }
      // if (res == 'Already owned!'){
      //    setErr('Already owned!')
      // }
      setText(res)
   }
   return (
      <Card sx={{ maxWidth: '282px' }}>
         {/* <CardMedia
            component="img"
            height="140"
            image={image}
            alt="item sprite"
         /> */}
         <Box sx={{top: -20, left: '18%', position: 'relative', width: '150px', height: '120px'}}>
            {item.renderStatic()}
         </Box>
         <CardContent>
            <Typography variant="h7" sx={{fontWeight: 'medium', color: 'green'}}component="div">
               {capitalize(item.type)}
            </Typography>
            <Typography sx={{marginTop: '15px'}} variant="h6" component="div">
               {item.name}
            </Typography>
            <Typography sx={{marginTop: '15px', color: '#5c5c5c'}} variant="h7" component="div">
               Price: {itemPrice}
            </Typography>
            <Typography sx={{marginTop: '20px', color: '#5c5c5c'}} variant="h7" component="div">
               {item.description}
            </Typography>
         </CardContent>
         <CardActions sx={{marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography sx={{ color: text !== 'Success!' ? '#B53737' : 'green', marginBottom: '5px' }} variant="subtitle2">{text}</Typography>
            <Button variant='contained' color='success' size="small" onClick={handlePurchase}>Purchase</Button>
         </CardActions>
      </Card>
   );
}
