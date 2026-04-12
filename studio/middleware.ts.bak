import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
    // We now allow unauthenticated users to read the ontology dashboard.
    // Only the /admin panel is blocked at the edge. (Data mutations will be guarded individually in Server Actions).
    matcher: ["/admin/:path*"],
};
