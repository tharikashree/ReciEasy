import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import yticon from'../assets/yticon.png';
import axios from 'axios';

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const recipeDoc = await getDoc(doc(db, 'recipes', id));
                if (recipeDoc.exists()) {
                    setRecipe(recipeDoc.data());
                }
                else {
                    const spoonApiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
                    const spoonBaseUrl = process.env.REACT_APP_SPOONACULAR_URL;

                    const response = await axios.get(`${spoonBaseUrl}/${id}/information?apiKey=${spoonApiKey}`);
                    setRecipe(response.data);
                }
            } catch (error) {
                console.error('Error fetching recipe:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!recipe) {
        return <p>No recipe found!</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">{recipe.title}</h2>

                <img src={recipe.image} alt={recipe.name} className="w-full h-64 object-cover rounded-lg mb-4" />

                {recipe.vegetarian ? (<h3 className="text-xl font-semibold text-gray-700 mt-3 mb-3">{recipe.vegetarian ? "Vegetarian" : "Non-vegetarian"} || {recipe.vegetarian ? "Vegan" : "Not Vegan"} || {recipe.glutenFree ? "Gluten Free" : "Contains Gluten"} || {recipe.dairyFree ? "Dairy Free" : "Contains Dairy"}</h3>
                ) : (<h3 className="text-xl font-semibold text-gray-700 mt-3 mb-3">{recipe.description}</h3>)}

                {recipe.summary && (<div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Summary :</h3>
                    <p className='mb-2' dangerouslySetInnerHTML={{ __html: recipe.summary || '<p>No Summary available</p>' }}></p>
                </div>
                )}

                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Ingredients:</h3>
                    <ul className="list-disc list-inside">
                        {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
                            recipe.extendedIngredients.map((ingredient, index) => (
                                <li key={ingredient.id} className="text-gray-600">{ingredient.original}</li>
                            ))
                        ) : (
                            <ul className="list-disc list-inside">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index} className="text-gray-600">{ingredient}</li>
                                ))}
                            </ul>
                        )}
                    </ul>
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Instructions:</h3>
                    <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: recipe.instructions || '<p>No instructions available</p>' }} ></p>
                </div>

                    <a href={recipe.vidUrl} className="text-gray-700 hover:underline hover:text-blue-500">
                        <img src={yticon} alt="Youtube icon" className="h-8 w-auto"></img>
                    </a>
                
                {recipe.servings && (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Cooking Time:</h3>
                            <p className="text-gray-600" >{recipe.readyInMinutes} minutes</p>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-xl font-semibold text-gray-700 ">Serving : {recipe.servings} people</h3>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => window.history.back()}
                    className="py-2 px-4 bg-gray-800 text-white font-bold rounded-lg mt-3 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default RecipeDetails;
