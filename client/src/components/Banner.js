// Project imports
import { ReactComponent as MenuIcon } from '../icons/menu-outline.svg';
import { ReactComponent as CloseIcon } from '../icons/close-outline.svg';

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

export default Banner;
