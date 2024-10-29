const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const search = require('youtube-search');
const fs = require('fs');
const path = require('path');

const opts = {
    maxResults: 1,
    key: 'YOUR_YOUTUBE_API_KEY', // Replace with your YouTube API key
};

module.exports = {
    name: "yt",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "Downloads a YouTube video as MP3.",
    commandCategory: "Admin",
    usages: ".yt [song name]",
    async run(client, message, args) {
        const songName = args.join(' ');
        if (!songName) {
            return message.reply('Please provide a song name!');
        }

        // Search for the video
        search(songName, opts, (err, results) => {
            if (err) return message.reply('An error occurred while searching.');

            const videoUrl = results[0].link;

            // Download the video as MP3
            const outputPath = path.join(__dirname, 'downloads', `${songName}.mp3`);
            ytdl(videoUrl, { quality: 'highestaudio' })
                .pipe(fs.createWriteStream(outputPath))
                .on('finish', () => {
                    message.channel.send({ files: [outputPath] });
                })
                .on('error', (error) => {
                    console.error(error);
                    message.reply('There was an error downloading the video.');
                });
        });
    }
};
