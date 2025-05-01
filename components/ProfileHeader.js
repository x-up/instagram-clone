export default function ProfileHeader({ profile, postCount }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <img
                src={profile.avatar_url || "/avatar-default.png"}
                alt="avatar"
                width={100}
                height={100}
                style={{ borderRadius: "50%" }}
            />
            <div>
                <h2 style={{ margin: 0 }}>{profile.username}</h2>
                <p style={{ marginTop: "8px", fontSize: "14px", color: "#aaa" }}>
                    {postCount} {postCount === 1 ? "post" : "posts"}
                </p>
            </div>
        </div>
    );
}
