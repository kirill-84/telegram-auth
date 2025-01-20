import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";

const BOT_TOKEN = process.env.BOT_TOKEN?.trim();
if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not defined in environment variables");
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
    return;
  }

  try {
    console.log("Received query:", req.query);

    if (!req.query || Object.keys(req.query).length === 0) {
      res.status(400).json({ success: false, message: "No query parameters provided" });
      return;
    }

    const hash = Array.isArray(req.query.hash) ? req.query.hash[0] : req.query.hash;
    if (!hash) {
      res.status(400).json({ success: false, message: "Missing 'hash' parameter" });
      return;
    }

    const authData = Object.keys(req.query).reduce((acc, key) => {
      if (key !== "hash") {
        acc[key] = Array.isArray(req.query[key]) ? req.query[key][0] : req.query[key];
      }
      return acc;
    }, {} as Record<string, string>);

    console.log("Auth Data:", authData);

    const dataCheckString = Object.keys(authData)
      .sort()
      .map((key) => `${key}=${authData[key]}`)
      .join("\n");

    console.log("Data Check String (Raw Output):", dataCheckString);
    console.log("Data Check String (UTF-8 Encoded):", Buffer.from(dataCheckString, 'utf-8'));

    console.log("BOT_TOKEN (raw):", BOT_TOKEN);
    console.log("BOT_TOKEN (Buffer view):", Buffer.from(BOT_TOKEN, "utf-8"));

    const hmacBuffer = crypto
      .createHmac("sha256", BOT_TOKEN)
      .update(dataCheckString, "utf-8")
      .digest();
    console.log("HMAC Buffer:", hmacBuffer);
    console.log("HMAC Buffer Hex:", hmacBuffer.toString("hex"));

    const providedHashBuffer = Buffer.from(hash, "hex");
    console.log("Provided Hash Buffer:", providedHashBuffer);

    for (let i = 0; i < hmacBuffer.length; i++) {
      console.log(`Byte ${i}: HMAC=${hmacBuffer[i]} Provided Hash=${providedHashBuffer[i]}`);
    }

    if (hmacBuffer.toString("hex") === hash) {
      res.status(200).json({ success: true, authData });
    } else {
      res.status(401).json({ success: false, message: "Authentication failed. HMAC does not match hash." });
    }
  } catch (err) {
    console.error("Error during authentication:", err);
    const error = err instanceof Error ? err : new Error("Unknown error occurred");
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}
