import React, { useState, useEffect } from "react";
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
const URL = process.env.NEXT_PUBLIC_API;
export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [updateTask, setUpdateTask] = useState({
    description: "",
    status: "",
  });
  const [task, setTask] = useState({
    description: "",
    status: "TODO",
  });

  useEffect(() => {
    async function fetchAllTasks() {
      const res = await (
        await fetch(URL, {
          method: "GET",
        })
      ).json();
      setTasks([...res.tasks]);
    }
    fetchAllTasks();
  }, []);

  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };
  const onDragOver = (e) => {
    e.preventDefault();
  };
  const onDrop = async (e, cate) => {
    let id = e.dataTransfer.getData("id");
    const prevTask = { ...tasks.find((ite) => ite.id == id) };
    const tasked = tasks.map((ite) => {
      if (ite.id == id) {
        ite.status = cate;
      }
      return ite;
    });

    setTasks([...tasked]);
    try {
      const updatedTask = await (
        await fetch(`${URL}?id=${prevTask.id}`, {
          body: JSON.stringify({
            description: prevTask.description,
            status: cate,
          }),
          method: "PATCH",
        })
      ).json();
    } catch (err) {
      if (err) {
        const tasked = tasks.map((ite) =>
          ite.id == prevTask.id ? prevTask : ite
        );
        setTasks([...tasked]);
      }
    }
  };

  const deleteTask = async (id) => {
    const res = await (
      await fetch(`${URL}?id=${id}`, {
        method: "DELETE",
      })
    ).json();
    if (res) {
      setTasks([...tasks.filter((ite) => ite.id !== id)]);
    }
  };
  const updateTaskFunc = async () => {
    const { task } = await (
      await fetch(`${URL}?id=${updateTask.id}`, {
        body: JSON.stringify({
          description: updateTask.description,
          status: updateTask.status,
        }),
        method: "PATCH",
      })
    ).json();
    if (task) {
      setTasks([...tasks.map((ite) => (ite.id === task.id ? task : ite))]);
      setUpdateTask({
        description: "",
        status: "",
      });
    }
  };

  const AddTask = async () => {
    if (task.description.length > 0) {
      const res = await (
        await fetch(URL, {
          body: JSON.stringify({
            description: task.description,
          }),
          method: "POST",
        })
      ).json();
      setTasks([...tasks, res.task]);
      setTask({ description: "", status: "TODO" });
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateTask({
      ...updateTask,
      description: e.target.value,
    });
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
          value={task.description}
          variant="standard"
          onChange={(e) => setTask({ ...task, description: e.target.value })}
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
                  .filter((it) => it.status === item)
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
                              value={updateTask.description}
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
                          <Box sx={{ flex: "3" }}>{it.description}</Box>
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
