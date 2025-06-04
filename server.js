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

