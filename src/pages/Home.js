import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';


const spoonApiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
const spoonBaseUrl = process.env.REACT_APP_SPOONACULAR_URL;

// Fetch recipes from API
const fetchRecipesFromAPI = async () => {

    try {
        const response = await axios.get(`${spoonBaseUrl}/random?apiKey=${spoonApiKey}&number=20`); 
        return response.data.recipes; 
    } catch (error) {
        console.error('Error fetching recipes from API:', error);
        return [];
    }
};

// Fetch recipes from Firestore
const fetchRecipesFromFirestore = async () => {
    try {
        const recipeCollection = collection(db, 'recipes');
        const snapshot = await getDocs(recipeCollection);
        const recipes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return recipes;
    } catch (error) {
        console.error('Error fetching recipes from Firestore:', error);
        return [];
    }
};

const HomePage = () => {
    const [recipes, setRecipes] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const apiRecipes = await fetchRecipesFromAPI();
            const firestoreRecipes = await fetchRecipesFromFirestore();
            const allRecipes = [...apiRecipes, ...firestoreRecipes];
            setRecipes(allRecipes);
            
        };
        fetchData();
    }, []);

    return (
        <div className="flex">
            <main className="flex-1">
                <NavBar />
                <div className="p-4 bg-gray-700 " >
                    <div className='flex gap-32 justify-center items-center '> 
                        <Link to='/search-recipe' className="bg-orange-500 text-white text-center w-48  font-bold py-3 px-6 rounded-full shadow-lg hover:rounded-md transition duration-300  ">Search Recipes</Link>
                        <Link to='/my-recipe' className="bg-orange-500 text-white w-48 text-center  font-bold py-3 px-6 rounded-full shadow-lg hover:rounded-md transition duration-300  ">My Recipes</Link>
                    </div>
                    <div className="grid grid-cols-1 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {recipes.map(recipe => (    
                        <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
