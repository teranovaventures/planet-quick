export default () => {
    console.log("⚡ Strapi is loading config/plugins.ts...");
  
    // Debugging: Log API Token (REMOVE in production)
    console.log("🔑 Strapi API Token:", "4e9b6205a6b8f924b043b6e0a63069a9974e3ea8f33a3e7df211a88dd47373dfdf34eea19d91fe105a6d2a46eb228cb71ad4e84171eb0b393fcbc51f339fb0b37bc63103572d0c03af860efeb820cc5ba6793634b5773b48d86508932d21a7b32576292a60d12cda6f3aa95b9f1cc005a980f6f19242cc74a58b7b26a7f2649f");
  
    return {
        "users-permissions": {
          config: {
            providers: {
              google: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                redirectUri: "http://localhost:1337/api/auth/google/callback",
              },
            },
            local: {
              allowedFields: ["email", "password"], // ✅ Allow registration with only email & password
            },
          },
        },
      };
    };