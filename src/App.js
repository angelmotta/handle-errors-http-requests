import { useEffect, useState } from "react";

// Custom error class to include error code
class ApiError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [errorState, setErrorState] = useState(null);
    const API_URL_USERS = "http://localhost:3000/users";
    const API_URL_POSTS = "http://localhost:3000/posts";

    useEffect(() => {
        console.log(`useEffect called`);
        const fetchData = async () => {
            try {
                // First request
                const response1 = await fetch(API_URL_USERS);
                if (!response1.ok) {
                    throw new ApiError(
                        `First request failed with Users endpoint`,
                        response1.status
                    );
                }
                console.log(`Got successful response from request #1`);
                const dataResponse1 = await response1.json();
                const userEmail = dataResponse1[0].email;
                const userId = dataResponse1[0].id;
                setCurrentUser(userEmail); // update state variable

                // Second request
                const response2 = await fetch(API_URL_POSTS);
                if (!response2.ok) {
                    console.log(`Second request failed bro!`);
                    throw new ApiError(
                        `Second request failed with Posts endpoint`,
                        response2.status
                    );
                }
                console.log(`Got successful response from request #2`);
                const dataResponse2 = await response2.json();
                const userPosts = dataResponse2.filter(
                    (post) => post.user_id === userId
                );
                setPosts(userPosts); // update state variable
            } catch (err) {
                console.log(`Catched error`);
                console.log(err.message);
                console.log(err.code);
                if (err instanceof ApiError) {
                    setErrorState({
                        message: err.message,
                        code: err.code,
                    });
                } else {
                    setErrorState({
                        message: err.message,
                        code: "UNKNOWN",
                    });
                }
            }
        };

        fetchData();
    }, []);

    if (errorState) {
        return (
            <>
                <h1>Manage http requests</h1>
                <h2>Something went wrong</h2>
                <h3>Error message: {errorState.message}</h3>
                <h3>Error code: {errorState.code}</h3>
            </>
        );
    }
    return (
        <>
            <h1>Manage http requests</h1>
            <h2>User: {currentUser}</h2>
            <h2>Posts:</h2>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>{post.text}</li>
                ))}
            </ul>
        </>
    );
};

export default App;
