// React imports
import { useEffect, useState } from 'react';

// Other libraries
import axios from 'axios';

// Project imports
import { ReactComponent as AddIcon } from '../icons/add-circle-outline.svg';
import { ReactComponent as FolderIcon } from '../icons/folder-open-outline.svg';

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

    // Reload the folder list when folder list is displayed
    useEffect(()=>{
       axios.get("/api/getfolderlist")
       .then(res=>{
          console.log("/getfolderlist",res);
          if (res.status === 200) {
             setFolderList([...res.data]);
          }
       });
    }, [show])
 
    // CSS class ShowSidebar is used to control visibility of folder sidebar
    let showSidebarString = (show) ? "ShowSidebar" : "";

    return (
       <div className={"FolderList "+showSidebarString }>
          { folderList.map((val, idx)=>{
             console.log(val);
             return(
                <FolderListItem 
                    key={idx} 
                    item={val} 
                    setFolder={setFolder} 
                    setSideBarVisibility={setSideBarVisibility}
                />
             )
          })}
          <div className="FolderListItem" onClick={ ()=>{ 
             let name = prompt("Create new folder:");
             if (name !== "") {
                axios.post("/api/newfolder", {title: name})
                .then(response=>{
                   setFolder(response.data.id);
                   setSideBarVisibility(false);
                })
             }
          }}><AddIcon/>New</div>
       </div>
    )
}

export default FolderList;
