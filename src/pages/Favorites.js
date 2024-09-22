import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import NavBar from '../components/NavBar';
import RecipeCard from '../components/RecipeCard';

const Favorites = () => {
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);  // Track current user

    useEffect(() => {
        const checkUser = () => {
            onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
            });
        };
        const fetchFavorites = async () => {
            
            if (!user) {
                setError('');
                return;
            }

            try {
                const userFavoritesCollection = collection(db, 'users', user.uid, 'favorites');
                const querySnapshot = await getDocs(userFavoritesCollection);
                const favoritesData = querySnapshot.docs.map(doc => doc.data().recipeId);

                // Fetch the actual recipes
                const recipesCollection = collection(db, 'recipes');
                const allRecipesSnapshot = await getDocs(recipesCollection);
                const allRecipes = allRecipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Filter the recipes that are in the user's favorites
                const filteredFavorites = allRecipes.filter(recipe => favoritesData.includes(recipe.id));
                setFavoriteRecipes(filteredFavorites);
            } catch (err) {
                setError('Failed to fetch favorite recipes.');
            }
        };

        checkUser();
        fetchFavorites();
    }, [user]);

    return (
        <>
        <NavBar/>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 p-4">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Favorite Recipes</h2>

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {user ? (
                        favoriteRecipes.length > 0 ? (
                            <ul className="space-y-4">
                                {favoriteRecipes.map((recipe) => (
                                    <RecipeCard key={recipe.id} recipe={recipe} />
                                ))}
                            </ul>
                        ) : (
                                <p className="text-gray-700 text-center ">No favorite recipes found.</p>
                        )
                    ) : (
                            <p className="text-center text-3xl">👻</p>
                    )}
                </div>
            </div></>
    );
};

export default Favorites;
