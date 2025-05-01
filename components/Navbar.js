import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import styles from "../styles/Navbar.module.css";
import NewPostModal from "./NewPostModal";
import HomeIcon from "./icons/HomeIcon";
import AddPostIcon from "./icons/AddPostIcon";
import InstagramLogo from "./icons/InstagramLogo";

export default function Navbar() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState(null);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        (async () => {
            const { data: session } = await supabase.auth.getUser();
            const user = session?.user;
            if (!user) return;

            const { data: profile } = await supabase
                .from("profiles")
                .select("username, avatar_url")
                .eq("id", user.id)
                .single();

            if (!profile) {
                router.push("/login");
            }

            if (profile?.username) setUsername(profile.username);
            if (profile?.avatar_url) setAvatar(profile.avatar_url);
        })();
    }, []);

    return (
        <>
            <aside className={styles.sidebar}>
                <div className={styles.topNav}>
                    <InstagramLogo />

                    <Link href="/" className={styles.navItem}>
                        <HomeIcon />
                        <span>Home</span>
                    </Link>

                    <button onClick={() => setShowModal(true)} className={styles.navItem}>
                        <AddPostIcon />
                        <span>Create</span>
                    </button>

                    {username && (
                        <Link href={`/profile/${username}`} className={styles.navItem}>
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    backgroundColor: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src={avatar || "/avatar-default.png"}
                                    alt="profile avatar"
                                    style={{ width: 28, height: 28, borderRadius: "50%" }}
                                />
                            </div>
                            <span>Profile</span>
                        </Link>
                    )}
                </div>

                <div className={styles.logoutSection}>
                    <div className={styles.divider} />
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            window.location.href = "/login";
                        }}
                        className={styles.navItem}
                    >
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {showModal && <NewPostModal onClose={() => setShowModal(false)} />}
        </>
    );
}
