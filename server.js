
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/collab-docs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const DocumentSchema = new mongoose.Schema({
    content: String,
});

const Document = mongoose.model('Document', DocumentSchema);

app.get('/document/:id', async (req, res) => {
    const { id } = req.params;
    let document = await Document.findById(id);

    if (!document) {
        document = new Document({ _id: id, content: '' });
        await document.save();
    }

    res.send(document);
});

io.on('connection', (socket) => {
    socket.on('join', (documentId) => {
        socket.join(documentId);
        socket.on('edit', async (data) => {
            const { id, content } = data;
            await Document.findByIdAndUpdate(id, { content });
            socket.to(documentId).emit('update', content);
        });
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});