process.env.NODE_ENV ||= "production";
process.env.HOST ||= "0.0.0.0";
process.env.NITRO_HOST ||= process.env.HOST;

await import("./.output/server/index.mjs");
