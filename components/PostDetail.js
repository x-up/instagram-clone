import LikeButton from "./LikeButton";
import styles from "../styles/PostDetail.module.css";

export default function PostDetail({ post, liked, likes }) {
    if (!post) return <p style={{ color: "white", padding: "40px" }}>Loading...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.imageSection}>
                <img src={post.image_url} alt="post" />
            </div>

            <div className={styles.detailsSection}>
                <div className={styles.header}>
                    <img
                        src={post.profiles?.avatar_url || "/avatar-default.png"}
                        alt="avatar"
                        className={styles.avatar}
                    />
                    <span className={styles.username}>{post.profiles?.username}</span>
                </div>

                <div className={styles.caption}>
                    <strong>{post.profiles?.username}</strong> {post.caption}
                </div>

                <LikeButton postId={post.id} initialLiked={liked} initialCount={likes} />

                <div className={styles.timestamp}>
                    {new Date(post.created_at).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
}
