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
[
  { question: "What's your favorite fruit?", impostor: "What's your favorite vegetable?" },
  { question: "What's your favorite breakfast food?", impostor: "What's your favorite dinner food?" },
  { question: "What's your favorite season?", impostor: "What's your favorite holiday?" },
  { question: "What color do you wear the most?", impostor: "What color do you dislike most?" },
  { question: "What's your favorite type of music?", impostor: "What's your favorite book genre?" },
  { question: "What's your favorite fast food restaurant?", impostor: "What's your favorite fancy restaurant?" },
  { question: "What's your favorite animal?", impostor: "What's your favorite insect?" },
  { question: "What's your dream vacation destination?", impostor: "Where did you last travel?" },
  { question: "What movie have you seen the most times?", impostor: "What movie have you never seen but want to?" },
  { question: "What's your favorite drink?", impostor: "What's your favorite snack?" },
  { question: "What's your favorite pizza topping?", impostor: "What's your favorite burger topping?" },
  { question: "What's your favorite sport to watch?", impostor: "What's your favorite sport to play?" },
  { question: "What was your favorite subject in school?", impostor: "What subject did you dislike in school?" },
  { question: "What's your favorite ice cream flavor?", impostor: "What's your favorite cake flavor?" },
  { question: "What's your favorite board game?", impostor: "What's your favorite video game?" },
  { question: "What's your favorite TV show?", impostor: "What's your favorite movie?" },
  { question: "What's your favorite clothing brand?", impostor: "What's your favorite tech brand?" },
  { question: "What's your favorite social media app?", impostor: "What's your favorite messaging app?" },
  { question: "What's your favorite type of weather?", impostor: "What's your least favorite weather?" },
  { question: "What's your favorite dessert?", impostor: "What's your favorite appetizer?" },
  { question: "What's your favorite way to relax?", impostor: "What's your favorite way to exercise?" },
  { question: "What's your favorite holiday tradition?", impostor: "What's your least favorite holiday chore?" },
  { question: "What's your favorite breakfast drink?", impostor: "What's your favorite evening drink?" },
  { question: "What's your favorite type of pet?", impostor: "What's a pet you'd never own?" },
  { question: "What's your favorite kind of cookie?", impostor: "What's your favorite kind of candy?" },
  { question: "What's your favorite smell?", impostor: "What's a smell you dislike?" },
  { question: "What's your favorite restaurant?", impostor: "What's your favorite food truck?" },
  { question: "What's your favorite time of day?", impostor: "What's your least favorite time of day?" },
  { question: "What's your favorite city?", impostor: "What's a city you want to visit?" },
  { question: "What's your favorite type of movie?", impostor: "What's your favorite TV genre?" },
  { question: "What's your favorite outdoor activity?", impostor: "What's your favorite indoor hobby?" },
  { question: "What's your favorite sandwich?", impostor: "What's your favorite wrap or burrito?" },
  { question: "What's your favorite cereal?", impostor: "What's your favorite granola bar?" },
  { question: "What's your favorite tech gadget?", impostor: "What's your favorite kitchen gadget?" },
  { question: "What's your favorite emoji?", impostor: "What's an emoji you never use?" }
]

  
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

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (name) => {
    players[socket.id] = { name, answer: null };
    console.log(`${name} joined.`);

    // If first player, pick imposter and question
    if (Object.keys(players).length === 1) {
      const q = pickQuestion();
      currentQuestion = q;
      // Pick imposter randomly
      imposterId = socket.id;
    } else if (!imposterId) {
      imposterId = socket.id;
    }

    // Tell the player their question (normal or imposter)
    const question = socket.id === imposterId ? currentQuestion.imposter : currentQuestion.question;
    socket.emit('question', question);

    // Broadcast player list
    io.emit('players', Object.values(players).map(p => p.name));
  });

  socket.on('answer', (answer) => {
    if (!players[socket.id]) return;
    players[socket.id].answer = answer;

    // Broadcast answers to everyone (except sender)
    io.emit('answers', Object.entries(players).map(([id, p]) => ({
      id,
      name: p.name,
      answer: p.answer,
    })));

    // Optional: add logic to check if all answered, then reveal imposter
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete players[socket.id];

    // Reset if no players
    if (Object.keys(players).length === 0) resetGame();

    // Broadcast updated player list
    io.emit('players', Object.values(players).map(p => p.name));
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
