import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import landingbg from '../assets/landingbg.png';
import './lstyle.css';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar/>

            {/* Main Content */}
            <div className="flex flex-grow bg-no-repeat max-w-full" id='image'
                style={{ backgroundImage: `url(${landingbg})` }}>

                <div className="w-full md:w-1/2 ml-10 flex flex-col justify-center pl-12 ">
                    <h2 className="text-4xl md:text-6xl text-white font-bold mb-4">Cooking made easy</h2>
                    <p className="text-xl text-white mb-8">
                        Easy to use and offers a variety of irresistable recipes that appeal to beginners and experts alike. <br></br>Ready to get cooking?
                    </p>
                    <div className="flex justify-center md:justify-start">
                        <Link
                            to="/home"
                            className="bg-orange-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-orange-400 transition duration-300"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default LandingPage;
