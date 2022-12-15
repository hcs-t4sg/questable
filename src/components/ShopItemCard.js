import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Link } from "react-router-dom";

export default function ShopItemCard({image, itemType, itemName, itemAmt, itemDescription }) {
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
            {/* <Button size="small" component={Link} to={`/class/${classID}`}>Purchase</Button> */}
         </CardActions>
      </Card>
   );
}
