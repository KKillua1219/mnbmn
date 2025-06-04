const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Questions for the game (30 normal + imposter variations)
const QUESTIONS = [
   { question: "Name a fruit", imposter: "Name a vegetable" },
  { question: "Name a country in Europe", imposter: "Name a country in Asia" },
  { question: "Name a color", imposter: "Name a shade of gray" },
  { question: "Name a type of pet", imposter: "Name a wild animal" },
  { question: "What is your go-to karaoke song", imposter: "What song makes you cry" },
  { question: "What fictional world would you most like to live in", imposter: "What is the scariest movie" },
  { question: "What celebrity would you most like to switch lives with", imposter: "Who is the most controversial celebrity of all time" },
  { question: "If you won the lottery, what percent would you give your parents", imposter: "How much is a valid tip at a restaurant" },
  { question: "What is a movie you love", imposter: "What is the most overrated movie" },
  { question: "Where would you go if you could teleport anywhere", imposter: "What is your least favourite country" },
  { question: "What is the lowest age you are willing to date", imposter: "What should be the age of consent" },
  { question: "What celebrity with a bad reputation do you secretly look up to", imposter: "What celebrity would you put in jail or an asylum" },
  { question: "What is your best physical feature", imposter: "What do you think is the grossest body part" },
  { question: "How many times do you poop a week", imposter: "How many push-ups can you do" },
  { question: "What is the most alcoholic drinks you've had in one night", imposter: "Pick a number between 0–30" },
  { question: "What’s a hobby you wish you had more time for", imposter: "What’s a hobby you think is a waste of time" },
  { question: "What’s your dream job", imposter: "What’s a job you could never do" },
  { question: "What’s a smell you love", imposter: "What’s a smell that makes you gag" },
  { question: "What’s your favorite fast food chain", imposter: "What fast food place would you never eat at again" },
  { question: "What’s a talent you’re proud of", imposter: "What’s something you’re surprisingly bad at" },
  { question: "What’s your go-to comfort show or movie", imposter: "What’s a show or movie you can't stand" },
  { question: "What’s your favorite way to relax", imposter: "What’s something that stresses you out for no reason" },
  { question: "What’s the best gift you’ve ever received", imposter: "What’s the worst gift you’ve ever given" },
  { question: "What’s your biggest fear", imposter: "What’s something others fear that you don’t get" },
  { question: "Who in your life makes you laugh the most", imposter: "Who in your life takes themselves way too seriously" },
  { question: "What’s your favorite holiday", imposter: "What holiday do you secretly find overrated" },
  { question: "What’s a trend you’re into", imposter: "What’s a trend you can’t stand" },
  { question: "What’s your favorite thing to do on a weekend", imposter: "What’s something you avoid doing on weekends" },
  { question: "What’s your guilty pleasure snack", imposter: "What food do people love that you think is gross" },
  { question: "What’s the last song you played", imposter: "What’s a song you hate that everyone seems to love" },
  { question: "What app do you use the most", imposter: "What app have you deleted and never looked back" },
  { question: "What’s something you’re saving up for", imposter: "What’s something you regret spending money on" },
  { question: "What’s your biggest pet peeve", imposter: "What’s something that annoys everyone else but not you" },
  { question: "What’s a country you’d love to visit", imposter: "What’s a place you’ve been to and didn’t like" },
  { question: "What’s a habit you’re proud of", imposter: "What’s a habit you’re trying to break" },
  { question: "What lie do you tell most often", imposter: "What’s the worst lie someone ever told you" },
  { question: "What’s the most embarrassing thing you’ve Googled", imposter: "What’s the smartest thing you’ve Googled" },
  { question: "What’s your worst habit when no one’s watching", imposter: "What’s something you pretend to hate but secretly love" },
  { question: "What’s a hill you’re willing to die on", imposter: "What’s an opinion you pretend to agree with to avoid arguments" },
  { question: "Who do you instantly judge on sight", imposter: "Who do you instantly trust for no reason" },
  { question: "What’s the most questionable thing in your search history", imposter: "What’s something you searched this week that made you feel old" },
  { question: "What’s the pettiest reason you ended something with someone", imposter: "What’s something petty someone did that made you fall more in love" },
  { question: "What’s something you’re too old to be doing but do anyway", imposter: "What’s something you’re too young to be doing but do anyway" },
  { question: "What’s the dumbest thing you believed for way too long", imposter: "What’s something everyone believes but you still don’t buy it" },
  { question: "What’s your most unhinged ick", imposter: "What’s your weirdest green flag" },
  { question: "Who do you think would survive longest in a zombie apocalypse", imposter: "Who would die first in a zombie apocalypse" },
  { question: "What’s the most shameless selfie you’ve posted", imposter: "What’s a selfie you regret posting immediately after" },
  { question: "What’s a totally normal thing that irrationally creeps you out", imposter: "What’s a creepy thing you weirdly find comforting" },
  { question: "What’s the most ridiculous argument you’ve ever had", imposter: "What’s an argument you lost but still think you were right" },
  { question: "If someone was playing you in a movie, who would it be", imposter: "Who would play your worst enemy in a movie" },
  { question: "What’s something that always makes you laugh, no matter what", imposter: "What’s something that always makes you cringe, no matter what" },
  { question: "If you were famous, what would your scandal be about", imposter: "If someone you know got famous, what would their scandal be" },
  { question: "What’s the most random thing you’ve cried over", imposter: "What’s the most random thing you’ve celebrated way too hard" },
  { question: "What’s a completely useless skill you’re proud of", imposter: "What’s a skill everyone else has that you still don’t" },
  { question: "What’s the best movie of all time", imposter: "What’s the most overrated movie ever" },
  { question: "Who’s the greatest musician ever", imposter: "Who’s the most overhyped musician ever" },
  { question: "What’s the best fast food chain", imposter: "What fast food place deserves to go out of business" },
  { question: "Who’s the most attractive celebrity", imposter: "Who’s a celebrity everyone finds hot but you don’t get it" },
  { question: "What’s the best TV show of the last 10 years", imposter: "What TV show is insanely overrated" },
  { question: "What’s the best album ever made", imposter: "What album do people pretend to like" },
  { question: "What’s the greatest video game of all time", imposter: "What popular game is secretly boring" },
  { question: "What’s the best pizza topping combo", imposter: "What topping ruins a pizza instantly" },
  { question: "Who’s the best comedian alive", imposter: "Which “comedian” isn’t actually funny at all" },
  { question: "What’s your favorite childhood show", imposter: "What childhood show aged terribly" },
  { question: "What’s a movie that deserves an Oscar", imposter: "What Oscar-winning movie was actually trash" },
  { question: "What’s the best social media app", imposter: "Which social media app is the absolute worst" },
  { question: "What’s the best accent in the world", imposter: "What’s the most annoying accent" },
  { question: "What’s the best city you’ve visited", imposter: "What city was a total letdown" },
  { question: "Who’s the best character in a TV show or movie", imposter: "Who’s the most useless character in a good show or movie" },
  { question: "What’s the best school subject", imposter: "What subject is a waste of time" },
  { question: "What celebrity deserves more love", imposter: "What celebrity should just retire already" },
  { question: "What’s your favorite holiday", imposter: "Which holiday is wildly overrated" },
  { question: "What’s your favorite genre of music", imposter: "What genre of music is just noise to you" },
  { question: "What’s your favorite takeout meal", imposter: "What takeout meal always disappoints" }
  // Add more questions here (30+)
];

// Game state per room (simple demo with 1 room)
let players = {};
let imposterId = null;
let currentQuestion = null;

function pickQuestion() {
  const index = Math.floor(Math.random() * QUESTIONS.length);
  return QUESTIONS[index];
}

function resetGame() {
  players = {};
  imposterId = null;
  currentQuestion = null;
}

let revealTimeout = null;
let readyPlayers = new Set();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (name) => {
    players[socket.id] = { name, answer: null };
    console.log(`${name} joined.`);

    if (Object.keys(players).length === 1) {
      // Pick question and imposter once players exist
      const q = pickQuestion();
      currentQuestion = q;

      // Pick random imposter from current players
      const playerIds = Object.keys(players);
      imposterId = playerIds[Math.floor(Math.random() * playerIds.length)];
    }

    // Send each player their question (imposter or normal)
    const question = socket.id === imposterId ? currentQuestion.imposter : currentQuestion.question;
    socket.emit('question', question);

    // Broadcast player list and ready status
    io.emit('players', Object.values(players).map(p => p.name));
    io.emit('readyStatus', Array.from(readyPlayers));
  });

  socket.on('ready', () => {
    if (!players[socket.id]) return;

    readyPlayers.add(socket.id);
    console.log(`${players[socket.id].name} is ready.`);

    // Notify all players who is ready
    io.emit('readyStatus', Array.from(readyPlayers));

    // Check if all players are ready
    const allReady = Object.keys(players).length > 0
      && Object.keys(players).every(id => readyPlayers.has(id));

    if (allReady) {
      console.log('All players ready! Starting 15-second countdown.');

      if (revealTimeout) clearTimeout(revealTimeout);

      revealTimeout = setTimeout(() => {
        io.emit('reveal', currentQuestion.question);
        // Optionally reset ready players for next round
        readyPlayers.clear();
        io.emit('readyStatus', Array.from(readyPlayers));
      }, 15000);
    }
  });

  socket.on('answer', (answer) => {
    if (!players[socket.id]) return;
    players[socket.id].answer = answer;

    io.emit('answers', Object.entries(players).map(([id, p]) => ({
      id,
      name: p.name,
      answer: p.answer,
    })));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete players[socket.id];
    readyPlayers.delete(socket.id);

    if (Object.keys(players).length === 0) {
      resetGame();
      if (revealTimeout) {
        clearTimeout(revealTimeout);
        revealTimeout = null;
      }
    }

    io.emit('players', Object.values(players).map(p => p.name));
    io.emit('readyStatus', Array.from(readyPlayers));
  });
});
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
