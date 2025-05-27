import react, {useState, useEffect} from 'react';
import {getItem, setItem} from './Utils/localStorage';
import './style/widget.css'

function addWidget() {

   const divStyle = {
      background: "#016fb9ff",
      fontFamily: "catV",
      textAlignLast: "center",
      zIndex: "2",
      padding: "1vw",
      border: "dashed #ec4e20ff .5vw" ,
      borderRadius: "0",
      position: "fixed",
      width: "calc(100% - 3vw)",
   }

   const fillerDivStyle = {
      height: "max(15vh, 23vw)"
   }

   const hStyle = {
      fontSize: "4vw",
      fontWeight: "bold",
      color: "#353531ff"

   }

   const inputContainer = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "0",
   }

   const inputStyle = {
      fontFamily: "CatV",
      fontWeight: "bold",
      marginRight: "2vw",
      fontSize: "4.5vw",
      lineHeight: "2.5vw",
      width: "40%",
      border: "solid .3vw #ff9505ff",
      background: "#353531ff",
      color: "#ec4e20ff",
   }

   const inputButton = {
      background: "#ff9505ff",
      border: "none",
      fontSize: "5vw",
      color: "#353531ff",
      marginRight: "1vw",
      cursor: "pointer",
   }

   const downloadButton = {
      background: "#ec4e20ff",
      border: "none",
      fontSize: "2.45vw",
      color: "#353531ff",
      margin: "1vw",
      cursor: "pointer",


   }

   const taskStyle = {
      borderRadius: "4vw",
      border: "solid .1em #ec4e20ff",
      background: "#ff9505ff",
      marginTop: "2vh",
      marginBottom: "2vh",
      display: "flex",
      justifyContent: "right",
      alignItems: "center",
      margin: "2vw",
      fontFamily: "CatV",
      fontSize: "4vw",
      padding: "1vw"
      
   }

   const removeButton = {
      width: "10vw",
      margin: "2vw",
      padding: "1vw",
      borderRadius: "1.5vw",
      background: "#ec4e20ff",
      border: "none",
      fontSize: "3vw",
      fontFamily: "CatV",
      fontColor: "#353531ff",
      cursor: "pointer",

   }

   const moveButton = {
      margin: "2vw",
      background: "transparent",
      border: "none",
      fontSize: "5vw",
      cursor: "pointer",
   }

   const [tasks, setTasks] = useState(() => {
      const saved = getItem("tasks");

      console.log('found Local Storage' + saved);

      return saved ? saved : ['ex: eat', 'ex: sleep', 'ex: build ui'];
   });

   const [newTask, setNewTask] = useState("");

   useEffect(() => {
      setItem('tasks', tasks);
      console.log('Set Local Storage' + tasks);
   }, [tasks]);

   function downloadFile(data, type = 'json') {
   const date = new Date().toISOString().split('T')[0];
  const fileData = type === 'json'
    ? JSON.stringify(data, null, 2)
    : data.join('\n');

  const blob = new Blob([fileData], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = type === 'json' ? `tasks-${date}.json` : `tasks-${date}.txt`;
  a.click();

  URL.revokeObjectURL(url);
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      let content = e.target.result;
      let importedTasks;

      if (file.name.endsWith('.json')) {
        importedTasks = JSON.parse(content);
      } else {
        importedTasks = content.split('\n');
      }

      setTasks(importedTasks); 
    } catch (error) {
      console.error("Failed to load file:", error);
    }
  };

  reader.readAsText(file);
}


   const handleInputChange = (event) => {

      setNewTask(event.target.value);
   }

   function addTask() {
      if (newTask.trim() !== "") {
         setTasks(t => [...t, newTask]);
         setNewTask("");
      }
         
      
   }

   function moveUp(index) {
      const updatedTasks = [...tasks];

      [updatedTasks[index],updatedTasks[index + 1]] = [updatedTasks[index + 1],updatedTasks[index]];

      setTasks(updatedTasks);

   }

   function moveDown(index) {
      const updatedTasks = [...tasks];

      [updatedTasks[index],updatedTasks[index - 1]] = [updatedTasks[index - 1],updatedTasks[index]];

      setTasks(updatedTasks);
   }

   function deleteTask(index) {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
   }

   return(
      <>
         <div style={divStyle}>

            <h1 style={hStyle}>Add 'ToDo'</h1>

            <div style={inputContainer}>

               <input
                  id="taskInput"
                  type="text"
                  placeholder="Enter Task"
                  value={newTask}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                  addTask()}}} style={inputStyle}
                  />

               <button className="inputButton" style={inputButton} onClick={addTask}>Add</button>
               <button className="inputButton" style={downloadButton} onClick={() => downloadFile(tasks, 'json')}>Download JSON</button>
               <button className="inputButton" style={downloadButton} onClick={() => downloadFile(tasks, 'txt')}>Download TXT</button>

            </div>

            <input type="file" onChange={handleFileUpload} />

         </div>

         <div id="fillerDiv" style={fillerDivStyle}></div>

         <div>
            {tasks.slice().reverse().map((task, index) => {

            const originalIndex = tasks.length - 1 - index;

            return(
               <li key={index} style={taskStyle}>

               {task}

               {originalIndex !== (tasks.length - 1) && (<button className="moveButton" style={moveButton} onClick={() => moveUp(originalIndex)}>⬆️</button>)}
               

               {originalIndex !== (0) && (<button style={moveButton} className="moveButton" onClick={() => moveDown(originalIndex)}>⬇️</button>)}

                              <button style={removeButton} className="removeButton" onClick={() => deleteTask(originalIndex)}>
                  DONE
               </button>
               
            </li>
            )
            })}
         </div> 
      </>

   )
}

export default addWidget;