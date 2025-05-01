import PostCard from "./PostCard";

export default function PostGrid({ posts }) {
    if (!posts?.length) return <p style={{ color: "white" }}>No posts yet.</p>;

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "2px",
            }}
        >
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}
