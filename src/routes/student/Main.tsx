import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DoneIcon from "@mui/icons-material/Done";
import {
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { format, fromUnixTime } from "date-fns";
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import * as React from "react";
import { useEffect, useState } from "react";
import TaskModalStudent from "../../components/student/TaskModalStudent";
import { Classroom, Player, Repeatable, TaskWithStatus } from "../../types";
import { db } from "../../utils/firebase";
import { completeRepeatable, completeTask } from "../../utils/mutations";

// TODO Rewrite this component, it's very inefficient and unmaintainable

function truncate(description: string) {
  if (description.length > 50) {
    return description.slice(0, 50) + "...";
  }
  return description;
}

interface ComponentProps {
  classroom: Classroom;
  player: Player;
}

export default function Main({ classroom, player }: ComponentProps) {
  const [assigned, setAssigned] = useState<TaskWithStatus[]>([]);
  const [completed, setCompleted] = useState<TaskWithStatus[]>([]);
  const [confirmed, setConfirmed] = useState<TaskWithStatus[]>([]);
  //   const [filter, setFilter] = useState("all");
  //   const [filteredTasks, setFilteredTasks] = useState(null);
  const [overdue, setOverdue] = useState<TaskWithStatus[]>([]);
  const [repeatables, setRepeatables] = useState<Repeatable[]>([]);

  // Boolean to show which page should be shown (tasks/repeatables)
  const [isRepeatables, setIsRepeatables] = useState<0 | 1>(0);

  // Stores the currently active tasks page:
  // (0) All Quests
  // (1) Requested
  // (2) Confirmed
  // (3) Overdue
  // (4) Repeatables
  const [page, setPage] = useState<0 | 1 | 2 | 3 | 4>(0);

  // Stores the currently active repeatables page
  // (0) All Repeatables
  const [repPage, setRepPage] = useState<0>(0);

  // useEffect to fetch task information
  useEffect(() => {
    // fetch task information
    const q = query(collection(db, `classrooms/${classroom.id}/tasks`));
    onSnapshot(q, (snapshot) => {
      const taskFetch = async () => {
        const assigned: TaskWithStatus[] = [];
        const completed: TaskWithStatus[] = [];
        const confirmed: TaskWithStatus[] = [];
        const overdue: TaskWithStatus[] = [];

        snapshot.forEach((doc) => {
          // Find assigned, completed, and confirmed tasks using player's id.
          if (doc.data().assigned?.includes(player.id)) {
            assigned.push(
              Object.assign(
                { id: doc.id, status: "Not Done" },
                doc.data()
              ) as TaskWithStatus
            );
          }
          if (doc.data().completed?.includes(player.id)) {
            completed.push(
              Object.assign(
                { id: doc.id, status: "Confirmation Requested" },
                doc.data()
              ) as TaskWithStatus
            );
          }
          if (doc.data().confirmed?.includes(player.id)) {
            confirmed.push(
              Object.assign(
                { id: doc.id, status: "Confirmed" },
                doc.data()
              ) as TaskWithStatus
            );
          }
          // if task is overdue, add to overdue list
          if (doc.data().due < Date.now() / 1000) {
            overdue.push(
              Object.assign({ id: doc.id }, doc.data()) as TaskWithStatus
            );
          }
        });
        setAssigned(assigned);
        setCompleted(completed);
        setConfirmed(confirmed);
        setOverdue(overdue);
      };
      taskFetch().catch(console.error);
    });
  }, [classroom.id, player.id]);

  // useEffect to fetch repeatable information
  useEffect(() => {
    // function to return array that contains only tasks where the player's completions is less than the max completions
    const filterMaxedOutRepeatables = (repeatables: Repeatable[]) => {
      let filteredArray: Repeatable[] = [];

      repeatables.forEach(async (repeatable: Repeatable) => {
        const compRef = doc(
          db,
          `classrooms/${classroom.id}/repeatables/${repeatable.id}/playerCompletions/${player.id}`
        );
        const compSnap = await getDoc(compRef);
        const confRef = doc(
          db,
          `classrooms/${classroom.id}/repeatables/${repeatable.id}/playerConfirmations/${player.id}`
        );
        const confSnap = await getDoc(confRef);

        // ! I changed the || to an && below during typescript migration. This might affect functionality
        if (compSnap.exists() && confSnap.exists()) {
          if (
            compSnap.data().completions + confSnap.data().confirmations <
            repeatable.maxCompletions
          ) {
            filteredArray.push(repeatable);
          }
        } else {
          filteredArray.push(repeatable);
        }
      });
      return filteredArray;
    };

    const repeatableQuery = query(
      collection(db, `classrooms/${classroom.id}/repeatables`)
    );
    onSnapshot(repeatableQuery, (snapshot) => {
      const repeatablesFetch = async () => {
        const repeatable: Repeatable[] = [];
        snapshot.forEach((doc) => {
          if (doc.data().assigned?.includes(player.id)) {
            repeatable.push(
              Object.assign({ id: doc.id }, doc.data()) as Repeatable
            );
          }
        });
        setRepeatables(filterMaxedOutRepeatables(repeatable));
      };
      repeatablesFetch().catch(console.error);
    });
  }, [classroom.id, player.id]);

  const handleTaskComplete = (task: TaskWithStatus) => {
    if (
      window.confirm("Are you sure you want to mark this task as complete?")
    ) {
      completeTask(classroom.id, task.id, player.id);
    }
  };

  const handleRepeatableComplete = (repeatable: Repeatable) => {
    if (
      window.confirm("Are you sure you want to complete this repeatable task?")
    ) {
      console.log(repeatable.id);
      completeRepeatable(classroom.id, repeatable.id, player.id);
    }
  };

  // Returns the quests that should be displayed on the page
  // NOTE: Overdue tasks are still in the "assigned", "completed", or "confirmed" lists, but they are *also* in the "overdue" list.

  const getQuests = () => {
    if (isRepeatables) {
      switch (page) {
        case 0:
          return assigned.concat(completed).concat(confirmed);
        case 1:
          return [];
        case 2:
          return confirmed;
        case 3:
          return overdue;

        default:
          return [];
      }
    } else {
      console.log(repeatables);
      switch (repPage) {
        case 0:
          return repeatables;
      }
    }
  };

  const handleTabChange = (
    event: React.SyntheticEvent,
    newTabIndex: 0 | 1 | 2 | 3 | 4
  ) => {
    setPage(newTabIndex);
  };

  const handleIsRepChange = (
    event: React.SyntheticEvent,
    newTabIndex: 0 | 1
  ) => {
    setIsRepeatables(newTabIndex);
  };
  const handleRepPageChange = (event: React.SyntheticEvent, newTabIndex: 0) => {
    setRepPage(newTabIndex);
  };

  const completeTaskButton = (task: TaskWithStatus) => {
    const completedIncludesTask = completed.every(
      (taskInCompleted) => taskInCompleted.id === task.id
    );
    const confirmedIncludesTask = confirmed.every(
      (taskInConfirmed) => taskInConfirmed.id === task.id
    );

    if (completedIncludesTask || confirmedIncludesTask) {
      return (
        <IconButton>
          <CheckBoxIcon />
        </IconButton>
      );
    } else {
      <IconButton onClick={() => handleTaskComplete(task)}>
        <CheckBoxOutlineBlankIcon />
      </IconButton>;
    }
  };

  const completeRepeatableButton = (repeatable: Repeatable) => {
    return (
      <IconButton
        onClick={() => {
          handleRepeatableComplete(repeatable);
        }}
      >
        <DoneIcon />
      </IconButton>
    );
  };

  //   function a11yProps(index) {
  //     return {
  //       id: `simple-tab-${index}`,
  //       "aria-controls": `simple-tabpanel-${index}`,
  //     };
  //   }

  //   const handleChange = (_, newValue) => {
  //     setFilter(newValue);
  //     if (newValue === "all") {
  //       setFilteredTasks(assigned.concat(completed).concat(confirmed));
  //     } else if (newValue === "assigned") {
  //       setFilteredTasks(assigned);
  //     } else if (newValue === "completed") {
  //       setFilteredTasks(completed);
  //     } else if (newValue === "confirmed") {
  //       setFilteredTasks(confirmed);
  //     }
  //   };

  return (
    <div style={{ marginLeft: "36px" }}>
      <Tabs value={isRepeatables} onChange={handleIsRepChange}>
        <Tab label="Tasks" />
        <Tab label="Repeatables" />
      </Tabs>

      {isRepeatables ? (
        <Tabs value={page} onChange={handleTabChange}>
          <Tab label="All Quests" />
          <Tab label="Requested" />
          <Tab label="Confirmed" />
          <Tab label="Overdue" />
        </Tabs>
      ) : (
        <Tabs value={repPage} onChange={handleRepPageChange}>
          <Tab label="All Repeatables" />
        </Tabs>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            {isRepeatables ? (
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Reward</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Description</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Reward</TableCell>
                <TableCell>Description</TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {isRepeatables
              ? (getQuests() as TaskWithStatus[]).map((task) => (
                  <TableRow
                    key={task.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      sx={{ paddingTop: 0, paddingBottom: 0, width: 0.01 }}
                      align="left"
                    >
                      <TaskModalStudent
                        task={task}
                        classroom={classroom}
                        player={player}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {task.name}
                    </TableCell>
                    <TableCell align="left">{task.reward}</TableCell>
                    <TableCell align="left">
                      {format(fromUnixTime(task.due), "MM/dd/yyyy")}
                    </TableCell>
                    <TableCell align="left">
                      {truncate(task.description)}
                    </TableCell>
                    <TableCell align="left">
                      {completeTaskButton(task)}
                    </TableCell>
                  </TableRow>
                ))
              : (getQuests() as Repeatable[]).map((repeatable) => (
                  <TableRow
                    key={repeatable.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      sx={{ paddingTop: 0, paddingBottom: 0, width: 0.01 }}
                      align="left"
                    >
                      {/* <TaskModalStudent
                        task={repeatable}
                        classroom={classroom}
                        player={player}
                      /> */}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {repeatable.name}
                    </TableCell>
                    <TableCell align="left">{repeatable.reward}</TableCell>
                    <TableCell align="left">
                      {truncate(repeatable.description)}
                    </TableCell>
                    <TableCell align="left">
                      {completeRepeatableButton(repeatable)}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
