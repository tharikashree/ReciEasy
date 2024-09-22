import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
    return (
        <header className="bg-gray-800 text-white p-4 flex flex-wrap justify-between items-center">
            
                <Link to="/"><img src={logo} alt="ReciEasy Logo" className="h-12 w-auto" /></Link>
            

            <div className="flex flex-wrap gap-4 bg-slate-600 p-3 rounded-md mb-4 md:mb-0">
                <h4 className="text-xl font-semibold">
                    <Link
                        to="/home"
                        className="hover:rounded-md bg-orange-500 px-4 py-2 text-white rounded-full"
                    >
                        Home
                    </Link>
                </h4>
                <h4 className="text-xl font-semibold">
                    <Link
                        to="/profile"
                        className="hover:bg-orange-500 p-2 rounded-md text-white"
                    >
                        Profile
                    </Link>
                </h4>
                <h4 className="text-xl font-semibold">
                    <Link
                        to="/my-recipe"
                        className="hover:bg-orange-500 p-2 rounded-md text-white"
                    >
                        My Recipes
                    </Link>
                </h4>
                <h4 className="text-xl font-semibold">
                    <Link
                        to="/search-recipe"
                        className="hover:bg-orange-500 p-2 rounded-md text-white"
                    >
                        Search Recipe
                    </Link>
                </h4>
                <h4 className="text-xl font-semibold">
                    <Link
                        to="/favorite"
                        className="hover:bg-orange-500 p-2 rounded-md text-white"
                    >
                        Favorites
                    </Link>
                </h4>
            </div>

            <nav className="flex flex-wrap gap-2">
                <a
                    href="/login"
                    className="hover:rounded-md bg-orange-500 text-white px-4 py-2 rounded-full"
                >
                    Login
                </a>
                <a
                    href="/signup"
                    className="hover:rounded-md bg-orange-500 text-white px-4 py-2 rounded-full"
                >
                    Sign Up
                </a>
            </nav>
        </header>
    );
};

export default Navbar;
