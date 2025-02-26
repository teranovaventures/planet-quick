// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: 885712063658-ut7qhrlemo34eq2q7qq5ks9k14rvvheb.apps.googleusercontent.com,
      clientSecret: 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,
    }),
    // Add additional providers if needed
  ],
  // Optional: add callbacks or session settings here
})