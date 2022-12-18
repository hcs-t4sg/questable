import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from "react-router-dom";

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
         </CardActions>
      </Card>
   );
}
