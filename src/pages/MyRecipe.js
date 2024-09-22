import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import NavBar from '../components/NavBar';
import yticon from '../assets/yticon.png';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

const MyRecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [newRecipe, setNewRecipe] = useState({
        title: '',
        description: '',
        ingredients: [],
        image: '',
        instructions: [],
        vidUrl:''
    });
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);


    useEffect(() => {
        // Fetch recipes based on logged-in user
        const fetchRecipes = async (userId) => {
            try {
                const recipesCollection = collection(db, 'recipes');
                // Query recipes that match the logged-in user's ID
                const userRecipesQuery = query(recipesCollection, where('userId', '==', userId));
                const querySnapshot = await getDocs(userRecipesQuery);

                const recipesData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.title,
                        description: data.description,
                        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [data.ingredients],
                        image: data.image,
                        instructions: Array.isArray(data.instructions) ? data.instructions : [data.instructions],
                        vidUrl:data.vidUrl
                    };
                });
                setRecipes(recipesData);
            } catch (err) {
                setError('Failed to fetch recipes.');
            }
        };

        // Check if user is logged in
        const checkUser = () => {
            onAuthStateChanged(auth, (currentUser) => {
                if (currentUser) {
                    setUser(currentUser);
                    fetchRecipes(currentUser.uid); // Fetch recipes for the logged-in user
                } else {
                    setUser(null);
                    setRecipes([]); // Clear recipes if no user is logged in
                }
            });
        };

        checkUser();
    }, []);
   
    const handleAddRecipe = async () => {
        if (!user) {
            setError('You need to log in to add recipes.👻');
            return;
        }

        try {
            const recipesCollection = collection(db, 'recipes'); // Reference to the 'recipes' collection

            // Add a new document with auto-generated ID
            const docRef = await addDoc(recipesCollection, {
                title: newRecipe.title,
                description: newRecipe.description,
                ingredients: newRecipe.ingredients,
                image: newRecipe.image,
                instructions: newRecipe.instructions,
                vidUrl:newRecipe.vidUrl,
                userId: user.uid 
            });

            // Update the document to include the auto-generated ID
            await updateDoc(docRef, {
                id: docRef.id // Add the auto-generated ID to the document
            });

            // Update local state with new recipe and auto-generated ID
            setRecipes([...recipes, { id: docRef.id, ...newRecipe }]);

            // Reset form inputs after successful recipe addition
            setNewRecipe({
                title: '',
                description: '',
                ingredients: [],
                image: '',
                instructions: [],
                vidUrl:''
            });
            setError(null); // Clear any errors after successful submission
        } catch (err) {
            setError('Failed to add recipe.👻');
            console.error(err); // Log the error for debugging
        }
    };



    const handleEditRecipe = async (id) => {
        try {
            const recipeDoc = doc(db, 'recipes', id);
            await updateDoc(recipeDoc, editingRecipe);
            setRecipes(recipes.map(recipe => (recipe.id === id ? { ...recipe, ...editingRecipe } : recipe)));
            setEditingRecipe(null);
        } catch (err) {
            setError('Failed to update recipe.👻');
        }
    };

    const handleDeleteRecipe = async (id) => {
        try {
            const recipeDoc = doc(db, 'recipes', id);
            await deleteDoc(recipeDoc);
            setRecipes(recipes.filter(recipe => recipe.id !== id));
        } catch (err) {
            setError('Failed to delete recipe.👻');
        }
    };

    const handleAddToFavorites = async (recipeId) => {
        if (!user) {
            setError('You need to log in to add recipes to favorites.👻');
            return;
        }

        try {
            const userFavoritesCollection = collection(db, 'users', user.uid, 'favorites');
            await addDoc(userFavoritesCollection, { recipeId });
            setError(null);
        } catch (err) {
            setError('Failed to add recipe to favorites.👻');
        }
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 p-4">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">My Recipes</h2>

                    {error && <p className="text-red-500">{error}</p>}
                    
                    {recipes.length > 0 ? (
                        <ul className="space-y-4">
                            {recipes.map((recipe) => (
                                <li key={recipe.id} className="p-4 bg-gray-100 mb-4 rounded-lg shadow-md">
                                    {editingRecipe && editingRecipe.id === recipe.id ? (
                                        <div>
                                            <input
                                                type="text"
                                                value={editingRecipe.title}
                                                onChange={(e) => setEditingRecipe({ ...editingRecipe, title: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                            <textarea
                                                value={editingRecipe.description}
                                                onChange={(e) => setEditingRecipe({ ...editingRecipe, description: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                            <textarea
                                                value={editingRecipe.ingredients.join(', ')}
                                                onChange={(e) => setEditingRecipe({ ...editingRecipe, ingredients: e.target.value.split(',').map(item => item.trim()) })}
                                                placeholder="Ingredients (separated by commas)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                            <input
                                                type="text"
                                                value={editingRecipe.image}
                                                onChange={(e) => setEditingRecipe({ ...editingRecipe, image: e.target.value })}
                                                placeholder="Image URL"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                            <textarea
                                                value={editingRecipe.instructions.join(', ')}
                                                onChange={(e) => setEditingRecipe({ ...editingRecipe, instructions: e.target.value.split(',').map(item => item.trim()) })}
                                                placeholder="Instructions (separated by commas)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                            <input
                                                type="text"
                                                value={editingRecipe.vidUrl}
                                                onChange={(e) => setEditingRecipe({ ...editingRecipe, vidUrl: e.target.value })}
                                                placeholder="Video URL"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            />
                                            <button
                                                onClick={() => handleEditRecipe(recipe.id)}
                                                className="py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingRecipe(null)}
                                                className="py-2 px-4 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800">{recipe.title}</h4>
                                            <p className="text-gray-700 mb-2">{recipe.description}</p>
                                            <p className="text-gray-700 mb-2">{Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.ingredients}</p>
                                            <img src={recipe.image} alt={recipe.title} className="mb-4 max-w-full h-auto rounded-lg" />
                                            <p className="text-gray-700 mb-4">{Array.isArray(recipe.instructions) ? recipe.instructions.join(', ') : recipe.instructions}</p>
                                                <a href={recipe.vidUrl} className="text-gray-700 hover:underline hover:text-blue-500">
                                                    <img src={yticon} alt="Youtube icon" className="h-8 mb-2 hover:h-9 w-auto"></img>
                                                </a>

                                            {user ? (
                                                <button
                                                    onClick={() => handleAddToFavorites(recipe.id)}
                                                    className="py-2 px-4 bg-red-200 mt-2 text-white font-bold rounded-lg hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 mr-2"
                                                >
                                                    🩷
                                                </button>
                                            ) : (
                                                <p className="text-red-500">Log in to add favorites</p>
                                            )}

                                            <button
                                                onClick={() => setEditingRecipe({ id: recipe.id, title: recipe.title, description: recipe.description, ingredients: recipe.ingredients, image: recipe.image, instructions: recipe.instructions,vidUrl:recipe.vidUrl })}
                                                className="py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRecipe(recipe.id)}
                                                className="py-2 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                            <p className="text-center text-red-500">No recipes found.👻</p>
                    )}

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">New Recipe</h3>
                        <input
                            type="text"
                            value={newRecipe.title}
                            onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
                            placeholder="Recipe Name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <textarea
                            value={newRecipe.description}
                            onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                            placeholder="Recipe Description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <textarea
                            value={newRecipe.ingredients.join(', ')}
                            onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value.split(',').map(item => item.trim()) })}
                            placeholder="Ingredients (separated by commas)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                            type="text"
                            value={newRecipe.image}
                            onChange={(e) => setNewRecipe({ ...newRecipe, image: e.target.value })}
                            placeholder="Image URL"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <textarea
                            value={newRecipe.instructions.join(', ')}
                            onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value.split(',').map(item => item.trim()) })}
                            placeholder="Instructions (separated by commas)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                            type="text"
                            value={newRecipe.vidUrl}
                            onChange={(e) => setNewRecipe({ ...newRecipe, vidUrl: e.target.value })}
                            placeholder="Video URL"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                            onClick={handleAddRecipe}
                            className="w-full py-2 px-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            Save
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default MyRecipesPage;
