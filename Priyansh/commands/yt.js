const ytdl = require('ytdl-core');
const { search } = require('youtube-search-api');
const fs = require('fs');
const path = require('path');

// Command Metadata
const commandInfo = {
    name: "yt",
    version: "1.0.0",
    hasPermission: 1, // Permission level (1 = general user, 2 = admin)
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "Search and download YouTube videos by song name",
    commandCategory: "YouTube",
    usages: "yt <song name>"
};

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
        return `**Command Information**\n\n- **Name:** ${commandInfo.name}\n- **Version:** ${commandInfo.version}\n- **Permission Level:** ${commandInfo.hasPermission}\n- **Credits:** ${commandInfo.credits}\n- **Description:** ${commandInfo.description}\n- **Category:** ${commandInfo.commandCategory}\n- **Usage:** ${commandInfo.usages}\n\nUse this command by typing "${commandInfo.usages}" to download a song.`;
    }
}
