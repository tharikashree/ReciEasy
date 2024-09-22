import React,{useState} from 'react';
import { db, auth, createUserWithEmailAndPassword } from '../firebaseConfig'; 
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user details to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        password,
        createdAt: new Date(),
      });

      // Clear form and handle successful sign-up
      setName('');
      setEmail('');
      setPassword('');
      setError(null);
      alert('Sign up successful!');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <NavBar/>
      <div className="flex items-center justify-center min-h-screen bg-gray-700">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <hr className="w-full border-gray-300" />
            <span className="text-gray-500 mx-4">or</span>
            <hr className="w-full border-gray-300" />
          </div>

          <button
            type="button"
            className="w-full mt-4 py-2 px-4 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
          >
            Sign Up with Google
          </button>
        </div>
      </div></>
  );
};

export default SignUp;
