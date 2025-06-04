import { gql, useMutation } from "@apollo/client";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const SignUp = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token]);
    const ADD_USER = gql`
  mutation AddUser($userInput: userInput!) {
    addUser(userInput: $userInput) {
      _id
      name
      email
    }
  }
`;
    const [addUser] = useMutation(ADD_USER);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        addUser({ variables: { userInput: { name, email, password } } })
            .then(response => {
                console.log('User added:', response.data.addUser);
                navigate('/login');
            })
            .catch(error => {
                console.error('Error adding user:', error);
            });
    }
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl">Sign Up</h1>
            <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" name="name" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" name="password" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;
