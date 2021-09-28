// React imports
import { useState } from 'react';

// Other libraries
import { v4 as uuid4 } from 'uuid';

// Project imports
import Banner from './components/Banner';
import FolderList from './components/FolderList';
import NoteList from './components/NoteList';
import Note from './components/Note';
import './App.css';

function App() {
   document.title = "Note keeper";
   const [sideBarVisibility, setSideBarVisibility] = useState(true);
   const [folder, setFolder] = useState(); // id of current folder
   const [item, setItem] = useState(String(uuid4())); // id of current item 
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
