// React imports
import { useEffect, useState } from 'react';

// Other libraries
import axios from 'axios';

function Note({id, folder}) {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");

   // Fetch content of the note when id changes
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

   const saveTitle = (e)=>{ 
      setTitle(e.target.value);
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
   }

   const saveContent = (e) => {
      setContent(e.target.value); 
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
   }

   return (
   <div className="Note" >
      <div>
         <input type="text" value={title} placeholder="title..." onChange={saveTitle}></input>
      </div>
      <div className="Height100">
         <textarea value={content} placeholder="note content..." onChange={saveContent}></textarea>
      </div>
   </div>
   )
}

export default Note;
