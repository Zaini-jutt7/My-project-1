const ytdl = require('ytdl-core');
const { search } = require('youtube-search-api');
const fs = require('fs');
const path = require('path');

// Metadata
const creatorName = "Zain Jutt";
const commandCategory = "YouTube";
const commandUsage = "yt <song name>";

async function downloadYouTubeVideo(songName) {
    const searchResults = await search(songName, { type: 'video' });
    
    if (searchResults.items && searchResults.items.length > 0) {
        const videoId = searchResults.items[0].id;
        const videoURL = `https://www.youtube.com/watch?v=${videoId}`;
        const outputPath = path.resolve(__dirname, `${songName}.mp4`);

        ytdl(videoURL)
            .pipe(fs.createWriteStream(outputPath))
            .on('finish', () => {
                console.log(`Download completed: ${outputPath}`);
            });

        return `Video is being downloaded: ${outputPath}`;
    } else {
        return 'Video nahi mil saki!';
    }
}

// Command handler
async function handleMessage(message) {
    if (message.startsWith('yt ')) {
        const songName = message.replace('yt ', '').trim();
        const downloadMessage = await downloadYouTubeVideo(songName);
        return downloadMessage;
    } else if (message === "yt help") {
        return `**Command Information**\n\n- **Creator:** ${creatorName}\n- **Category:** ${commandCategory}\n- **Usage:** ${commandUsage}\n\nUse this command by typing "yt <song name>" to download a song.`;
    }
}
