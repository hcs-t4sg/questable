import { Box } from "@mui/system";
import { Outfit } from "../../types";

/* Renders the player's avatar sprite. 

Keep in mind that the sprite stretches to fill its parent container. When using this, you must place <Avatar /> inside a parent MUI component with a defined width! */
interface ComponentProps {
  outfit: Outfit;
}

export default function Avatar({ outfit }: ComponentProps) {
  return (
    <Box
      sx={{
        width: "100%",
        position: "relative",
      }}
    >
      {outfit.body.renderStatic()}
      {outfit.hair.renderStatic()}
      {outfit.shirt.renderStatic()}
      {outfit.pants.renderStatic()}
      {outfit.shoes.renderStatic()}
    </Box>
  );
}
