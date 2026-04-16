import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
    const videoPath = path.join(process.cwd(), "assets", "greenEarthRotating.mp4");
    const videoBuffer = await readFile(videoPath);

    return new Response(videoBuffer, {
        headers: {
            "Content-Type": "video/mp4",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    });
}
