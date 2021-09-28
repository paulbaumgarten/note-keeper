// React imports
import { useEffect, useState } from 'react';

// Other libraries
import axios from 'axios';
import { v4 as uuid4 } from 'uuid';

// Project imports
import { ReactComponent as AddIcon } from '../icons/add-circle-outline.svg';

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

export default NoteList;
