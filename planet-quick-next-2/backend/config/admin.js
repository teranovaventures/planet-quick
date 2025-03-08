module.exports = ({ env }) => ({ auth: { secret: env("ADMIN_JWT_SECRET", "otBOcGR4VeD2xEE6PVTMWg==") } });
