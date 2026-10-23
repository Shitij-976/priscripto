import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { FiSearch, FiX } from 'react-icons/fi'

/**
 * Navbar Component:
 * - Brand logo and navigation links (Home, Doctors, About, Contact)
 * - Global search bar (desktop & mobile toggle) synchronized with AppContext
 * - Real-time redirection to /doctors upon search query entry
 * - User authentication state (Profile/Appointment dropdown or Create Account button)
 */
const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Local UI states
    const [showMenu, setShowMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    // Global context values
    const { token, setToken, userData, search, setSearch } = useContext(AppContext);

    /**
     * Clear auth token and log the user out
     */
    const logout = () => {
        setToken(false);
        localStorage.removeItem('token');
        navigate('/login');
    }

    /**
     * Handle search input changes:
     * Updates global search state and immediately routes to /doctors if user is elsewhere
     */
    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        if (!location.pathname.startsWith('/doctors')) {
            navigate('/doctors');
        }
    };

    /**
     * Handle search form submit (e.g. user pressing Enter)
     */
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!location.pathname.startsWith('/doctors')) {
            navigate('/doctors');
        }
    };

    /**
     * Clear the search input
     */
    const clearSearch = () => {
        setSearch('');
    };

    return (
        <div className='relative mb-5 border-b border-b-gray-400'>
            {/* Top Navigation Bar */}
            <div className='flex items-center justify-between text-sm py-4 gap-2'>
                {/* Brand Logo */}
                <img 
                    className='w-36 sm:w-44 cursor-pointer flex-shrink-0' 
                    onClick={() => navigate('/')} 
                    src={assets.logo} 
                    alt='Prescripto Logo' 
                />

                {/* Desktop Navigation Links */}
                <ul className='hidden md:flex items-center gap-6 lg:gap-8 font-medium'>
                    <NavLink to='/'>
                        <li className='py-1 hover:text-primary transition-colors'>Home</li>
                        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                    </NavLink>
                    <NavLink to='/doctors'>
                        <li className='py-1 hover:text-primary transition-colors'>Doctors</li>
                        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                    </NavLink>
                    <NavLink to='/about'>
                        <li className='py-1 hover:text-primary transition-colors'>About</li>
                        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                    </NavLink>
                    <NavLink to='/contact'>
                        <li className='py-1 hover:text-primary transition-colors'>Contact</li>
                        <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
                    </NavLink>
                </ul>

                {/* Right Actions: Search + User Account / Auth */}
                <div className='flex items-center gap-3 sm:gap-4'>
                    {/* Desktop Search Input with real-time query handling */}
                    <form 
                        onSubmit={handleSearchSubmit} 
                        className='hidden sm:flex items-center gap-2 bg-gray-50 hover:bg-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 border border-gray-300 rounded-full px-3 py-1.5 transition-all text-xs md:text-sm text-gray-700 w-44 md:w-56 lg:w-64'
                    >
                        <FiSearch className='text-gray-400 text-base flex-shrink-0' />
                        <input
                            type="text"
                            placeholder="Search doctor or specialty..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-xs sm:text-sm"
                        />
                        {search && (
                            <button 
                                type="button" 
                                onClick={clearSearch} 
                                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                                aria-label="Clear search"
                            >
                                <FiX className="text-sm" />
                            </button>
                        )}
                    </form>

                    {/* Mobile Search Icon Toggle */}
                    <button 
                        type="button"
                        onClick={() => setShowMobileSearch(prev => !prev)}
                        className='sm:hidden p-1.5 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100 transition'
                        aria-label="Toggle search"
                    >
                        <FiSearch className='text-xl' />
                    </button>

                    {/* Authenticated User Menu or Create Account Button */}
                    {token && userData ? (
                        <div className='flex items-center gap-2 cursor-pointer group relative'>
                            <img className='w-8 h-8 rounded-full object-cover border' src={userData.image || assets.profile_pic} alt="Profile" />
                            <img className='w-2.5' src={assets.dropdown_icon} alt="Dropdown" />
                            <div className='absolute top-0 pt-14 right-0 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                                <div className='min-w-48 bg-stone-100 rounded shadow-lg flex flex-col gap-3 p-4 border'>
                                    <p onClick={() => navigate('/my-profile')} className='hover:text-primary cursor-pointer transition'>My Profile</p>
                                    <p onClick={() => navigate('/my-appointments')} className='hover:text-primary cursor-pointer transition'>Appointments</p>
                                    <hr className='border-gray-300 my-1' />
                                    <p onClick={logout} className='hover:text-red-600 cursor-pointer transition'>Log Out</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate('/login')} 
                            className='bg-primary hover:bg-[#4b5bdb] text-white px-5 sm:px-8 py-2 sm:py-3 rounded-full font-light text-xs sm:text-sm transition-all'
                        >
                            Create Account
                        </button>
                    )}

                    {/* Mobile Hamburger Menu Icon */}
                    <img 
                        onClick={() => setShowMenu(true)} 
                        className='w-6 md:hidden cursor-pointer' 
                        src={assets.menu_icon} 
                        alt='Menu' 
                    />
                </div>
            </div>

            {/* Mobile Expandable Search Bar (when toggled) */}
            {showMobileSearch && (
                <div className='sm:hidden pb-3 px-1 animate-fadeIn'>
                    <form 
                        onSubmit={handleSearchSubmit} 
                        className='flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-full px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-primary/20'
                    >
                        <FiSearch className='text-gray-400 text-lg flex-shrink-0' />
                        <input
                            type="text"
                            placeholder="Search doctor, specialty, etc..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full bg-transparent outline-none text-gray-700 text-sm"
                            autoFocus
                        />
                        {search && (
                            <button 
                                type="button" 
                                onClick={clearSearch} 
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FiX className="text-base" />
                            </button>
                        )}
                    </form>
                </div>
            )}

            {/* Mobile Drawer Navigation Menu */}
            <div className={`${showMenu ? "fixed inset-0 w-full" : "h-0 w-0"} md:hidden z-30 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6 border-b'>
                    <img className='w-36' src={assets.logo} alt="Prescripto" />
                    <img className='w-7 cursor-pointer' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="Close" />
                </div>
                {/* Search Bar inside Drawer */}
                <div className='px-5 py-4'>
                    <form 
                        onSubmit={(e) => {
                            handleSearchSubmit(e);
                            setShowMenu(false);
                        }} 
                        className='flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-3 py-2 text-sm'
                    >
                        <FiSearch className='text-gray-400 text-base' />
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full bg-transparent outline-none text-gray-700 text-sm"
                        />
                        {search && (
                            <button type="button" onClick={clearSearch} className="text-gray-400">
                                <FiX className="text-base" />
                            </button>
                        )}
                    </form>
                </div>
                {/* Drawer Links */}
                <ul className='flex flex-col items-center gap-3 mt-2 px-5 text-lg font-medium'>
                    <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
                    <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink>
                </ul>
            </div>
        </div>
    )
}

export default Navbar
