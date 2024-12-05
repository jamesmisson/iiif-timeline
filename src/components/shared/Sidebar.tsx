import React from 'react';
import { Button } from 'react-aria-components';
import { FaThLarge, FaThList, FaClock, FaHome } from "react-icons/fa";


import './Sidebar.css';

type SidebarProps = {
  onMenuClick: (menu: string) => void; 
  activeItem: string;
};

const Sidebar: React.FC<SidebarProps> = ({ onMenuClick, activeItem }) => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Button
            className={`menu-button ${activeItem === 'Home' ? 'active' : ''}`}
            onPress={() => onMenuClick('Home')}
          >
            <FaHome />
          </Button>
        </li>
        <li>
          <Button
            className={`menu-button ${activeItem === 'Table' ? 'active' : ''}`}
            onPress={() => onMenuClick('Table')}
          >
            <FaThList/>
          </Button>
        </li>
        <li>
          <Button
            className={`menu-button ${activeItem === 'Gallery' ? 'active' : ''}`}
            onPress={() => onMenuClick('Gallery')}
          >
            <FaThLarge />
          </Button>
        </li>
        <li>
          <Button
            className={`menu-button ${activeItem === 'Timeline' ? 'active' : ''}`}
            onPress={() => onMenuClick('Timeline')}
          >
            <FaClock />
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

















// // Define the type for the menu items
// type MenuItem = {
//   id: number;
//   label: string;
//   onClick: () => void;
// };

// const Sidebar: React.FC = () => {
//   // Define menu items and corresponding actions
//   const menuItems: MenuItem[] = [
//     { id: 1, label: 'H', onClick: () => handleMenuClick('Home') },
//     { id: 2, label: 'T', onClick: () => handleMenuClick('Table') },
//     { id: 3, label: 'G', onClick: () => handleMenuClick('Gallery') },
//     { id: 4, label: 'T', onClick: () => handleMenuClick('Timeline') }
//   ];

//   // Define state to track the selected menu
//   const [activeItem, setActiveItem] = useState<string>('Home');

//   // Handle the click event for each menu item
//   const handleMenuClick = (menuLabel: string) => {
//     setActiveItem(menuLabel);
//     console.log(`${menuLabel} selected`);
//   };

//   return (
//     <div className="sidebar">
//       <ul>
//       {menuItems.map((item) => (
//           <li key={item.id}>
//             <Button
//               className={`menu-button ${activeItem === item.label ? 'active' : ''}`}
//               onPress={item.onClick}
//             >
//               {item.label}
//             </Button>
//           </li>
//         ))}

//       </ul>
//     </div>
//   );
// };

// export default Sidebar;
