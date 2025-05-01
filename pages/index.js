import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";

export default function Home() {
    const router = useRouter();
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        (async () => {
            const { data: session } = await supabase.auth.getUser();
            const user = session?.user;

            if (!user) {
                router.push("/login");
                return;
            }

            const { data: allProfiles } = await supabase
                .from("profiles")
                .select("id, username, avatar_url")
                .order("username", { ascending: true });

            setProfiles(allProfiles || []);
            console.log(profiles);
            if (profiles === null || profiles.username === null) {
                router.push("/login");
              }
        })();
    }, []);

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
                <h2>Explore Users</h2>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "20px",
                    }}
                >
                    {profiles.map((profile) => (
                        <a
                            key={profile.id}
                            href={`/profile/${profile.username}`}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                textDecoration: "none",
                                color: "white",
                            }}
                        >
                            <img
                                src={profile.avatar_url || "/avatar-default.png"}
                                alt="avatar"
                                width={40}
                                height={40}
                                style={{ borderRadius: "50%" }}
                            />
                            <span>{profile.username}</span>
                        </a>
                    ))}
                </div>
            </main>
        </>
    );
}
