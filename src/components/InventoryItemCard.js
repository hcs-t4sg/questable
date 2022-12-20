import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import { CardMedia } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
// import { Link } from "react-router-dom";
// import avatar from '../../src/assets/spriteSheets/current/char4.png'


// The display for an inventory card 
export default function InventoryItemCard({item}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
        <Box sx={{top: -20, left: '18%', position: 'relative', width: '150px', height: '120px'}}>
            {item.renderStatic()}
        </Box>

      <CardContent>
        <Typography gutterBottom variant="h5" component="div"> 
          Type: {item.type}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Name: {item.name}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          Description: {item.description}
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small">Select</Button>
      </CardActions>
    </Card>
  );
}





// export default function ShopItemCard({image, itemID, itemType, itemDescription }) {
//    return (
//       <Card>
//          <CardContent>

//             <Typography variant="h5" component="div">
//                {itemType}
//             </Typography>
//             <Typography variant="h4" component="div">
//                Amount: {itemDescription}
//             </Typography>
//          </CardContent>
//          <CardActions>
//             {/* <Button size="small" component={Link} to={`/class/${classID}`}>Purchase</Button> */}
//          </CardActions>
//       </Card>
//    );
// }


