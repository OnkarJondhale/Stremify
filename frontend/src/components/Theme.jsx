import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import PaletteIcon from '@mui/icons-material/Palette';

import {setTheme} from "../redux/slices/theme.slice"

import THEMES from "../utils/ThemeArray"

function Theme({ isOpen }) {
    const dispatch = useDispatch();

  const dataTheme = useSelector((state)=>state.theme);

    if (!isOpen) return null;

    function themeClickhandler(name)
    {
        localStorage.setItem("theme",name);
        dispatch(setTheme(name));
    }

    return (
        <div
            className="hidden sm:flex flex-col gap-2 items-center justify-start absolute h-96 w-72 overflow-y-scroll right-4 top-18 rounded-xl bg-base-100 shadow-lg p-2 z-[999]"
        >
            {THEMES.map((it, index) => (
                <div
                    key={index}
                    id={it.index}
                    className={`w-full flex items-center justify-between gap-2 p-2 hover:bg-base-200 rounded-lg transition cursor-pointer ${dataTheme==it.name ? 'bg-secondary' : ''}`}
                    onClick={()=> { themeClickhandler(it.name) }}
                >
                    <div className="min-w-6 text-primary">
                        <PaletteIcon />
                    </div>

                    <div className="flex-1 text-center text-sm font-medium text-base-content">
                        {it.label}
                    </div>

                    <div className="flex gap-1">
                        {it.colors.map((color, i) => (
                            <span
                                key={i}
                                className="rounded-full size-4 border border-base-300"
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}


export default Theme;