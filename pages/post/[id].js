import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Navbar from "../../components/Navbar";
import PostDetail from "../../components/PostDetail";

export default function PostPage() {
    const router = useRouter();
    const { id } = router.query;

    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (!id) return;

        (async () => {
            const { data: postData } = await supabase
                .from("posts")
                .select("*")
                .eq("id", id)
                .single();

            if (!postData) return;
            setPost(postData);

            const { data: authorData } = await supabase
                .from("profiles")
                .select("username, avatar_url")
                .eq("id", postData.user_id)
                .single();

            setAuthor(authorData);

            const { data: likesData } = await supabase
                .from("likes")
                .select("user_id")
                .eq("post_id", id);

            setLikes(likesData.length);

            const { data: sessionData } = await supabase.auth.getUser();
            const userId = sessionData?.user?.id;
            setLiked(likesData.some((like) => like.user_id === userId));
        })();
    }, [id]);

    if (!post || !author) {
        return <p style={{ color: "white", marginLeft: "250px", padding: "40px" }}>Loading...</p>;
    }

    return (
        <>
            <Navbar />
            <main
                style={{
                    marginLeft: "250px",
                    padding: "40px",
                    backgroundColor: "#000",
                    minHeight: "100vh",
                }}
            >
                <PostDetail post={post} author={author} liked={liked} likes={likes} />
            </main>
        </>
    );
}
