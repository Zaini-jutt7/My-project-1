const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');

module.exports = {
    name: "yt",
    version: "1.0.0",
    hasPermission: 2,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "Download YouTube video as MP3",
    commandCategory: "Admin",
    usages: "yt [url]",
    run: async (client, message, args) => {
        // Check if a URL was provided
        const url = args[0];
        if (!url) {
            return message.reply("Please provide a valid YouTube video URL.");
        }

        try {
            // Get video info
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title.replace(/[<>:"/\\|?*]+/g, ''); // Clean title for filename
            const outputPath = path.resolve(__dirname, `${title}.mp3`);

            // Start downloading the video and convert to MP3
            ffmpeg(ytdl(url, { quality: 'highestaudio' }))
                .setFfmpegPath(ffmpegPath) // Set FFmpeg path
                .audioBitrate(128)
                .save(outputPath)
                .on('end', () => {
                    message.reply(`Downloaded and converted "${title}" to MP3 successfully!`);
                    // Optionally, you can send the MP3 file as a message
                    // message.channel.send({ files: [outputPath] });
                })
                .on('error', (err) => {
                    console.error('Error downloading or converting:', err);
                    message.reply('Error downloading or converting the video. Please try again later.');
                });
        } catch (error) {
            console.error('Error fetching video information:', error);
            message.reply('Error fetching video information. Please ensure the URL is valid.');
        }
    }
};
