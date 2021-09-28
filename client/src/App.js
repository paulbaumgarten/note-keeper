// React imports
import { useEffect, useState } from 'react';
// Styling
import './App.css';
import { ReactComponent as MenuIcon } from './icons/menu-outline.svg';
import { ReactComponent as CloseIcon } from './icons/close-outline.svg';
import { ReactComponent as AddIcon } from './icons/add-circle-outline.svg';
import { ReactComponent as FolderIcon } from './icons/folder-open-outline.svg';
import axios from 'axios';
import { v4 as uuid4 } from 'uuid';

function Banner({ setSideBarVisibility, sideBarVisibility }) {
   return (
      <div className="Banner">
         <span>
            <button onClick={() => {
               setSideBarVisibility(!sideBarVisibility);
            }}>
               {(sideBarVisibility) ? <CloseIcon /> : <MenuIcon />}
            </button>
         </span>
         <span><h1>Note keeper</h1></span>
      </div>
   )
}

function FolderListItem({item, setFolder, setSideBarVisibility}) {
   return (
      <div className="FolderListItem" onClick={ ()=>{ 
         setFolder(item.id); 
         setSideBarVisibility(false);
      }}>
         <FolderIcon/>
         <span>{ item.title }</span>
      </div>
   )
}

function FolderList({ show, setFolder, setSideBarVisibility }) {
   const [folderList, setFolderList] = useState([]);
   useEffect(()=>{
      axios.get("/api/getfolderlist").then(res=>{
         console.log("/getfolderlist",res);
         if (res.status === 200) {
            setFolderList([...res.data]);
         }
      });
   }, [show])

   let showSidebarString = (show) ? "ShowSidebar" : "";
   return (
      <div className={"FolderList "+showSidebarString }>
         { folderList.map((val, idx)=>{
            console.log(val);
            return(
               <FolderListItem key={idx} item={val} setFolder={setFolder} setSideBarVisibility={setSideBarVisibility}/>
            )
         })}
         <div className="FolderListItem" onClick={ ()=>{ 
            let name = prompt("Create new folder:");
            if (name !== "") {
               axios.post("/api/newfolder", {title: name}).then(response=>{
                  setFolder(response.data.id);
                  setSideBarVisibility(false);
               })
            }
         }}><AddIcon/>New</div>
      </div>
   )
}

function NoteListItem({item, setItem}) {
   return (
      <div className="NoteListItem" onClick={ ()=>{ 
         setItem(item.id); 
      }}>
         <span>{ item.title }</span>
      </div>
   )
}

function NoteList({folder, setItem}) {
   const [noteList, setNoteList] = useState([]);

   useEffect(()=>{
      axios.get("/api/getnotelist?folderid="+folder)
      .then(res=>{
         if (res.status===200) {
            console.log("noteList:", res.data);
            setNoteList([...res.data]);
         }
      })
      .catch(err=>{
         console.log("err",err);
         setNoteList([])
      })
   }, [folder]);

   console.log(folder);
   return (<div className="NoteList">
      { noteList.map((val, idx)=>{
         return(
            <NoteListItem key={idx} item={val} setItem={setItem}/>
         )
      }) }
      <div className="NoteListItem" onClick={ ()=>{
         setItem(String(uuid4())); // Generate a uuid4 for a new note
      }}><AddIcon/>New</div>
   </div>)
}

function Note({id, folder}) {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");

   useEffect(()=>{
      console.log("Fetching note with id",id)
      axios.get("/api/getnote?noteid="+id)
      .then(res=>{
         if (res.status===200) {
            setTitle(res.data.title);
            setContent(res.data.content);
         }
      })
      .catch(err=>{
         console.log("err",err);
         setTitle("")
         setContent("")
      })
   }, [id]);

   return (
   <div className="Note" >
      <div>
         <input type="text" value={title} placeholder="title..."
         onChange={(e)=>{ 
            setTitle(e.target.value);
            console.log({id: id, folderid: folder, title: e.target.value})
            axios.post("/api/setnote", {id: id, folderid: folder, title: e.target.value})
            .then(res=>{
               if (res.status !== 200) {
                  console.log("res.status = ",res.status)
                  alert("Problem saving change. Possible network failure")
               }
            })
            .catch(err=>{
               console.log("err = ", err);
               alert("Problem saving change. Possible network failure")
            })
         }}></input>
      </div>
      <div className="Height100">
         <textarea value={content} placeholder="note content..." 
         onChange={(e)=>{ 
            setContent(e.target.value); 
            console.log({id: id, folderid: folder, title: e.target.value})
            axios.post("/api/setnote", {id: id, folderid: folder, content: e.target.value})
            .then(res=>{
               if (res.status !== 200) {
                  console.log("res.status = ",res.status)
                  alert("Problem saving change. Possible network failure")
               }
            })
            .catch(err=>{
               console.log("err = ", err);
               alert("Problem saving change. Possible network failure")
            })
         }}></textarea>
      </div>
   </div>
   )
}

function App() {
   document.title = "Note keeper";
   const [sideBarVisibility, setSideBarVisibility] = useState(true);
   const [folder, setFolder] = useState(); // id of current folder
   const [item, setItem] = useState(); // id of current item 
   return (
      <div className="App">
         <Banner setSideBarVisibility={setSideBarVisibility} sideBarVisibility={sideBarVisibility} />
         <FolderList show={sideBarVisibility} setSideBarVisibility={setSideBarVisibility} setFolder={setFolder}/>
         <NoteList folder={folder} setItem={setItem}/>
         <Note id={item} folder={folder}/>
      </div>
   );
}

export default App;
