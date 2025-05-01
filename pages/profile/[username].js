import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Navbar from "../../components/Navbar";
import ProfileHeader from "../../components/ProfileHeader";
import PostGrid from "../../components/PostGrid";

export default function ProfilePage() {
    const router = useRouter();
    const { username } = router.query;

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!username) return;

        (async () => {
            const { data: userProfile } = await supabase
                .from("profiles")
                .select("*")
                .eq("username", username)
                .single();

            if (!userProfile) return;

            setProfile(userProfile);

            const { data: userPosts } = await supabase
                .from("posts")
                .select("*")
                .eq("user_id", userProfile.id)
                .order("created_at", { ascending: false });

            setPosts(userPosts);
        })();
    }, [username]);

    if (!profile) {
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
                    color: "#fff",
                    minHeight: "100vh",
                }}
            >
                <ProfileHeader profile={profile} postCount={posts.length} />
                <hr style={{ margin: "20px 0", borderColor: "#222" }} />
                <PostGrid posts={posts} />
            </main>
        </>
    );
}
