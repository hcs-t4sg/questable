import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
<<<<<<< HEAD
import CardMedia from '@mui/material/CardMedia'
=======
>>>>>>> 34bd9cc (basic shop.js and shopitemcard.js outlines)
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from "react-router-dom";

<<<<<<< HEAD
export default function ShopItemCard({ image, itemType, itemName, itemPrice, itemDescription, classID }) {
   return (
      <Card sx={{maxWidth: '282px'}}>
         <CardMedia
            component="img"
            height="140"
            image="http://placekitten.com/200/300"
            alt="green iguana"
         />
         <CardContent>
            <Typography variant="h7" sx={{fontWeight: 'medium', color: 'green'}}component="div">
               {itemType}
            </Typography>
            <Typography sx={{marginTop: '15px'}} variant="h6" component="div">
               Item Name: {itemName}
            </Typography>
            <Typography sx={{marginTop: '15px', color: '#5c5c5c'}} variant="h7" component="div">
               Price: {itemPrice}
            </Typography>
            <Typography sx={{marginTop: '20px', color: '#5c5c5c'}} variant="h7" component="div">
               Description: {itemDescription}
            </Typography>
         </CardContent>
         <CardActions sx={{marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
            <Button variant='contained' color='success' size="small" component={Link} to={`/class/${classID}`}>Purchase</Button>
=======
export default function ShopItemCard({ image, itemType, itemName, itemAmt, itemDescription }) {
   return (
      <Card>
         <CardContent>
            <Typography variant="h5" component="div">
               {itemType}
            </Typography>
            <Typography variant="h3" component="div">
               Item Name: {itemName}
            </Typography>
            <Typography variant="h4" component="div">
               Amount: {itemAmt}
            </Typography>
            <Typography variant="h4" component="div">
               Amount: {itemDescription}
            </Typography>
         </CardContent>
         <CardActions>
            <Button size="small" component={Link} to={`/class/${classID}`}>Purchase</Button>
>>>>>>> 34bd9cc (basic shop.js and shopitemcard.js outlines)
         </CardActions>
      </Card>
   );
}
