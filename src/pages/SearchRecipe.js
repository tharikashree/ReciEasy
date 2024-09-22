import React, { useState } from 'react';
import axios from 'axios';
import { db } from '../firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore';
import RecipeCard from '../components/RecipeCard';
import NavBar from '../components/NavBar';

const SearchRecipePage = () => {
    const spoonApiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
    const spoonBaseUrl = process.env.REACT_APP_SPOONACULAR_URL;

    const [searchQuery, setSearchQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);

        try {
            
            const apiResponse = await axios.get(`${spoonBaseUrl}/complexSearch?apiKey=${spoonApiKey}&query=${searchQuery}&number=6`);
            const apiRecipes = apiResponse.data.results;
            
            const recipesCollection = collection(db, 'recipes');
            const q = query(recipesCollection, where('name', '==', searchQuery));
            const querySnapshot = await getDocs(q);
            const firestoreRecipes = querySnapshot.docs.map(doc => doc.data());
            console.log(firestoreRecipes);
            
            const allRecipes = [...apiRecipes, ...firestoreRecipes];
            setRecipes(allRecipes);
        } catch (err) {
            setError('Failed to fetch recipes.');
        } finally {
            setLoading(false);
        }
    };

    return (
    <>
    <NavBar/>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 p-4">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Search Recipe</h2>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter recipe name..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
                    />
                    <button
                        onClick={handleSearch}
                        className="w-full py-2 px-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        Search
                    </button>

                    {loading && <p className="mt-4 text-gray-700">Loading...</p>}
                    {error && <p className="mt-4 text-red-500">{error}</p>}

                    <div className="mt-6">
                        {recipes.length > 0 ? (
                            <ul className="space-y-4">
                                {recipes.map((recipe, index) => (
                                    <RecipeCard key={recipe.id} recipe={recipe} />
                                ))}
                            </ul>
                        ) : (
                            error && <p className="text-gray-700">No recipes found.</p>
                        )}
                    </div>
                </div>
            </div>
    </>
    );
};

export default SearchRecipePage;
