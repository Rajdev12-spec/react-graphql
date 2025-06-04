import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const LogIn = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token]);
    const LOGIN_USER = gql`
    mutation LoginUser($signInInput: signInInput!) {
        signInUser(signInInput: $signInInput) {
            token
        }
    }
    `;
    const [loginUser] = useMutation(LOGIN_USER);
    
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        loginUser({ variables: { signInInput: { email, password } } })
            .then(response => {
                localStorage.setItem('token', response.data.signInUser.token);
                navigate('/');
            })
            .catch(error => {
                console.error('Error logging in:', error);
            });
    }
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl">Log In</h1>
            <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" name="password" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer">Log In</button>
            </form>
        </div>
    );
}

export default LogIn;
