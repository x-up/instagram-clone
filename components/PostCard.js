import Link from "next/link";

export default function PostCard({ post }) {
    return (
        <Link href={`/post/${post.id}`} style={{ display: "block" }}>
            <img
                src={post.image_url}
                alt="Post"
                style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    display: "block",
                }}
            />
        </Link>
    );
}
