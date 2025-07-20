import { Link, useLocation } from "react-router-dom";
import AttractionsIcon from "@mui/icons-material/Attractions";
import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Paper } from '@mui/material';

import THEMES from "../utils/ThemeArray";
import { useSelector } from "react-redux";

function SimpleBottomNavigation({ bottomElements }) {
    const { pathname } = useLocation();
    const dataTheme = useSelector((state) => state.theme);
    const currTheme = THEMES.find(theme => theme.name === dataTheme);

    const currentValue = bottomElements.findIndex(item => item.path === pathname);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
            <BottomNavigation
                showLabels
                value={currentValue}
                sx={{
                    height: '48px',
                    backgroundColor: currTheme.colors[0],
                    '& .MuiBottomNavigationAction-root': {
                        color: currTheme.colors[1],
                        transition: 'color 0.2s ease',
                    },
                    '& .Mui-selected': {
                        color: currTheme.colors[2],
                        backgroundColor : currTheme.colors[0]
                    },
                }}
            >
                {bottomElements.map((item) => (
                    <BottomNavigationAction
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        component={Link}
                        to={item.path}
                    />
                ))}
            </BottomNavigation>
        </Paper>

    );
}

function Navbar({ navElements, bottomElements }) {
    return (
        <>
            <div className="min-h-12 w-full p-2 flex justify-between items-center relative z-10 border-b border-secondary">
                <Link to="/" className="flex items-center gap-2 text-primary p-2">
                    <AttractionsIcon sx={{ fontSize: 30 }} />
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
                        Streamify
                    </h1>
                </Link>

                <div className="hidden sm:flex items-center gap-4 text-primary pr-4">
                    {navElements?.map((item, index) =>
                        item?.icon ? (
                            <div key={index} className="cursor-pointer" onClick={item.onClickhandler}>
                                {item.icon}
                            </div>
                        ) : null
                    )}
                </div>
            </div>


            <div className="sm:hidden">
                <SimpleBottomNavigation bottomElements={bottomElements} />
            </div>
        </>
    );
}

export default Navbar;