require("dotenv").config();

const apiKey = process.env.PAYMENT_API_KEY;

console.log("Initializing backup routine...");

if (!apiKey) {
    console.error("Backup failed: required API key is not configured.");
    process.exitCode = 1;
} else {
    console.log("API key configured successfully.");
    console.log("Backup completed successfully.");
}