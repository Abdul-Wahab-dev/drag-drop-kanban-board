import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [updateTask, setUpdateTask] = useState({
    name: "",
    category: "",
    id: "",
  });
  const [task, setTask] = useState({
    name: "",
    category: "TODO",
    id: Date.now().toString(),
  });

  const onDragStart = (e, id) => {
    console.log(typeof id);
    e.dataTransfer.setData("id", id);
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };
  const onDrop = (e, cate) => {
    let id = e.dataTransfer.getData("id");

    let tasked = tasks.map((ite) => {
      if (ite.id === id) {
        ite.category = cate;
      }
      return ite;
    });

    setTasks([...tasked]);
  };

  const deleteTask = (id) => {
    setTasks([...tasks.filter((ite) => ite.id !== id)]);
  };
  const updateTaskFunc = () => {
    setTasks([
      ...tasks.map((ite) => (ite.id === updateTask.id ? updateTask : ite)),
    ]);
    setUpdateTask({
      name: "",
      category: "",
      id: "",
    });
  };

  const AddTask = async () => {
    if (task.name.length > 0) {
      const res = await fetch("http://localhost:3000/api/tasks", {
        body: JSON.stringify({
          description: task.name,
        }),
        method: "POST",
      });
      console.log(await res.json(), "res.json()");
      setTasks([...tasks, task]);
      setTask({ name: "", category: "TODO", id: Date.now().toString() });
    }
  };

  const handleUpdateChange = (e) => {
    console.log("handleUpdateChange");
    console.log(e.target.value);
    setUpdateTask({
      ...updateTask,
      name: e.target.value,
    });
    // const updated = tasks
  };

  return (
    <div>
      <Typography variant="h3" sx={{ textAlign: "center" }}>
        Drag & Drop Kanban board
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          margin: "15px 0",
        }}
      >
        <TextField
          placeholder="Task"
          value={task.name}
          variant="standard"
          onChange={(e) => setTask({ ...task, name: e.target.value })}
        />
        <Button size="small" variant="contained" onClick={() => AddTask()}>
          Add Task
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "35px",
          margin: "30px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {["BACKLOG", "TODO", "ONGOING", "DONE"].map((item) => (
          <Box
            sx={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              height: "100vh",
              overflowY: "auto",
              padding: "15px",
              borderRadius: "15px",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
            }}
            onDragOver={(e) => onDragOver(e)}
            key={item}
            onDrop={(e) => onDrop(e, item)}
            id={item}
          >
            <Typography variant="p">{item}</Typography>
            {tasks.length > 0
              ? tasks
                  .filter((it) => it.category === item)
                  .map((it) => (
                    <Box
                      draggable={true}
                      id={it.id}
                      key={it.id}
                      onDragStart={(e) => onDragStart(e, it.id)}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "15px",
                        margin: "15px 0",
                        borderRadius: "10px",
                        width: "100%",
                        boxShadow: "0 0 5px rgba(0 ,0 ,0, 0.1)",
                        gap: "10px",
                      }}
                    >
                      {updateTask.id === it.id ? (
                        <>
                          <Box sx={{ flex: "4" }}>
                            <TextField
                              placeholder="Task"
                              value={updateTask.name}
                              variant="standard"
                              onChange={(e) => handleUpdateChange(e)}
                            />
                          </Box>
                          <Box sx={{ flex: "1" }}>
                            <Button
                              size="small"
                              variant="contained"
                              type="button"
                              onClick={() => updateTaskFunc()}
                            >
                              update
                            </Button>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box sx={{ flex: "3" }}>{it.name}</Box>
                          <Box sx={{ flex: "1" }}>
                            <Stack direction="row">
                              <IconButton
                                onClick={() => setUpdateTask({ ...it })}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton onClick={() => deleteTask(it.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </Box>
                        </>
                      )}
                    </Box>
                  ))
              : null}
          </Box>
        ))}
      </Box>
    </div>
  );
}
