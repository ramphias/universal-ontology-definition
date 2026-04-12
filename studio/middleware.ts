export { default } from "next-auth/middleware";

export const config = {
    // Protect the root dashboard, ontology layer editors, and the admin panel.
    // We intentionally leave /api endpoints unguarded to allow NextAuth to work!
    matcher: ["/", "/layer/:path*", "/admin/:path*"],
};
