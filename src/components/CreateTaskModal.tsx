import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { getUnixTime } from "date-fns";
import * as React from "react";
import { useState } from "react";
import { addRepeatable } from "../utils/mutations";

import { Tab, Tabs } from "@mui/material";

import Grid from "@mui/material/Grid";
import { addTask } from "../utils/mutations";

import { Classroom, Player } from "../types";

export default function CreateTaskModal({
  classroom,
  player,
}: {
  classroom: Classroom;
  player: Player;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState<number>(10);
  const [dueDate, setDueDate] = useState<Date | null>(null);

  const [isRepeatable, setIsRepeatable] = useState(false);
  const [maxCompletions, setMaxCompletions] = useState(1);

  const handleOpen = () => {
    setOpen(true);
    setName("");
    setDueDate(new Date());
    setDescription("");
    setReward(10);
    setMaxCompletions(1);
    setIsRepeatable(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Mutation handlers

  const handleAdd = () => {
    if (isRepeatable) {
      // check the max completions input
      console.log("maxCompletions: " + maxCompletions);
      if (maxCompletions < 1) {
        setMaxCompletions(1);
        alert("Max completions must be greater than 0");
        return;
      }
      // else if(!Number.isInteger(maxCompletions))
      // {
      //    setMaxCompletions(1);
      //    alert("Max completions must be an integer");
      //    return;
      // }

      const newTask = {
        name,
        description,
        reward,
        maxCompletions,
      };

      addRepeatable(classroom.id, newTask, player.id).catch(console.error);
    } else {
      if (!dueDate) {
        window.alert("You need to provide a due date");
        return;
      }

      const newTask = {
        name,
        description,
        reward,
        due: getUnixTime(dueDate),
      };

      addTask(classroom.id, newTask, player.id).catch(console.error);
    }

    handleClose();
  };

  const openButton = (
    <Button
      sx={{ width: 1 }}
      onClick={handleOpen}
      startIcon={<AddCircleOutlineIcon />}
    >
      Create Manually
    </Button>
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setIsRepeatable(newValue === 1);
  };

  const repeatableButton = (
    <Tabs value={isRepeatable ? 1 : 0} onChange={handleTabChange}>
      <Tab label="One Time" />
      <Tab label="Repeatable" />
    </Tabs>
  );

  const actionButtons = (
    <DialogActions>
      <Button variant="contained" onClick={handleAdd}>
        Add Task
      </Button>
    </DialogActions>
  );

  return (
    <div>
      {openButton}
      <Modal
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        open={open}
        onClose={handleClose}
      >
        <Box
          sx={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            paddingTop: "40px",
            backgroundColor: "white",
            marginBottom: "18px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography fontWeight="light" variant="h5">
              Create Task
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <hr
            style={{
              backgroundColor: "#D9D9D9",
              height: "1px",
              borderWidth: "0px",
              borderRadius: "5px",
              width: "100%",
              marginBottom: "10px",
            }}
          />

          {repeatableButton}

          <TextField
            margin="normal"
            id="name"
            label="Task Name"
            fullWidth
            variant="standard"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            margin="normal"
            id="description"
            label="Description"
            fullWidth
            variant="standard"
            placeholder=""
            multiline
            maxRows={8}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              m: 2,
            }}
          >
            {/* either show a due date option or max completions based on if task is repeatable */}
            {!isRepeatable ? (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={dueDate}
                  onChange={(value) => setDueDate(value)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            ) : (
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                margin="normal"
                id="description"
                label="Max Completions"
                fullWidth
                variant="standard"
                placeholder=""
                multiline
                maxRows={8}
                value={maxCompletions}
                onChange={(event) =>
                  setMaxCompletions(parseInt(event.target.value))
                }
              />
            )}
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              m: 2,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="reward-dropdown-label">Reward</InputLabel>
              <Select
                labelId="reward-dropdown"
                id="reward-dropdown"
                value={reward}
                label="Reward"
                onChange={(event) => setReward(event.target.value as number)}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={40}>40</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <br />
          {/* center the save button */}
          <Grid container justifyContent="center">
            {actionButtons}
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
