import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({ name: '', email: '' });
    const navigate = useNavigate();

    useEffect(() => {
    const fetchUserData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                console.log(userDoc.data());
                if (userDoc.exists()) {
                    console.log('Document data:', userDoc.data());
                    setUser(userDoc.data());
                } else {
                    console.log('No such document!');
                    
                }
            } else {
                console.log('No authenticated user found.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    fetchUserData();
}, []);


    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                name: user.name,
                email: user.email,
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
    <>
        <NavBar/>
        <div className="flex items-center justify-center min-h-screen bg-gray-700">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Profile</h2>

                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    {isEditing ? (
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={user.name || ''}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={user.email || ''}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full py-2 px-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p className="text-gray-700 text-sm font-bold mb-2">Name</p>
                                    <p className="mb-4 text-gray-800">{user.name || '👻'}</p>

                            <p className="text-gray-700 text-sm font-bold mb-2">Email</p>
                                    <p className="mb-4 text-gray-800">{user.email || '👻'}</p>

                            <button
                                onClick={handleEdit}
                                className="w-full py-2 px-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
                            >
                                Edit
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full mt-4 py-2 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Logout
                </button>
            </div>
        </div>
    </>
    );
};

export default Profile;
