import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { Tooltip, IconButton } from '@mui/material';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import PaletteIcon from '@mui/icons-material/Palette';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Groups2Icon from '@mui/icons-material/Groups2';
import Badge from '@mui/material/Badge';

import Layout from "../components/Layout";
import { logout } from '../operations/auth';

function Home() {
    const user = useSelector((state) => state.user);
    const [themeModal,setThemeModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navElements = [
        { icon: <Tooltip title="Theme"><IconButton ><PaletteIcon className='text-primary'/></IconButton></Tooltip>, onClickhandler: () => { setThemeModal(prev => !prev) } },
        { icon: <Tooltip title="Logout"><IconButton ><LogoutIcon className='text-primary'/></IconButton></Tooltip>, onClickhandler: async () => await logout(dispatch, navigate) },
    ];

    const sidebarElements = [
        { label: "Home", icon: <HomeIcon  />, path: "/" },
        { label: "Friends", icon: <Badge badgeContent={4} > <PeopleAltIcon  /> </Badge> , path: "/friends"},
        { label: "Notifications", icon: <Badge badgeContent={sessionStorage.getItem("friend-request-count")} > <CircleNotificationsIcon  /> </Badge> , path: "/notifications"},
        { label: "Groups", icon: <Badge badgeContent={4} ><Groups2Icon  /> </Badge>, path: "/groups"},
        { label: "Livestreams", icon: <Badge badgeContent={4} > <Groups2Icon /> </Badge>, path: "/livestreams"},
    ];

    const bottomElements = [
        { label: "Home", icon: <HomeIcon />, path: "/" },
        { label: "Notification", icon:<Badge badgeContent={sessionStorage.getItem("friend-request-count")} >  <CircleNotificationsIcon /> </Badge>, path: "/notifications"},
        { label: "You", icon: <img src={user?.avatar} className='size-6 rounded-full '/>, path: "/profile" }
    ];

    return (
        <Layout
            user={user}
            navElements={navElements}
            sidebarElements={sidebarElements}
            bottomElements={bottomElements}
            themeModal={themeModal}
        />
    );
}

export default Home;