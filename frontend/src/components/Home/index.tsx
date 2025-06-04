import { gql, useApolloClient, useMutation, useQuery } from "@apollo/client"
import { useNavigate } from "react-router";
interface Note {
  _id: string;
  title: string;
  content: string;
}
const Home = () => {
  const GET_NOTES = gql`
  query getNotesByUser {
    getNotesByUser {
      _id
      title
      content
    }
  }
`;
  const CREATE_NOTE = gql`
  mutation createNote($noteInput: noteInput!) {
    createNote(noteInput: $noteInput) {
      _id
      title
      content
    }
  }
`;
  const { data, loading, error, refetch } = useQuery(GET_NOTES);
  const notes = data?.getNotesByUser ?? [];

  const [createNote, { data: createData }] = useMutation(CREATE_NOTE);
  const navigate = useNavigate();
  const client = useApolloClient();
  const handleCreateNote = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement).value;
    form.reset();

    await createNote({
      variables: {
        noteInput: {
          title,
          content
        }
      }
    });
    refetch();
  }
  const handleLogOut = () => {
    localStorage.removeItem("token");
    client.clearStore();
    navigate("/login");
    
  }


  return loading ? <h1> Loading...</h1> : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div>
        <h1 className="text-3xl">Welcome to the Note App</h1>
        <p className="text-lg">This is a simple note-taking application built with React and GraphQL.</p>
      </div>
      <div className="flex gap-4 items-center justify-center mt-8">
        <div className="mt-8 mb-8 w-[450px]">
          <form onSubmit={handleCreateNote} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="title">Title</label>
              <input type="text" id="title" name="title" className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700" htmlFor="content">Content</label>
              <textarea id="content" name="content" rows={4} className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required></textarea>
            </div>
            <div className="flex justify-between items-center">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Note</button>
              <button onClick={handleLogOut} className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">LogOut</button>
            </div>
          </form>
        </div>
        <div>
          <h1 className="text-3xl">Note Lists</h1>
          <ul>
            {
              notes.length > 0 ? (
                notes.map((note: Note, i: number) => (
                  <li key={note._id} className="flex gap-4 items-center  bg-white p-4 mb-2 rounded-lg shadow-md">
                    <div>{i + 1}</div>
                    <div>
                      <h2 className="text-xl">{note.title}</h2>
                      <p>{note.content}</p>
                    </div>

                  </li>
                ))
              ) : (
                <li>No notes found.</li>
              )
            }
          </ul>
        </div>

      </div>
    </div>
  );
}
export default Home;
