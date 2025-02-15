
const socket = io('http://localhost:5000');
const editor = document.createElement('textarea');
editor.style.width = '100%';
editor.style.height = '90vh';
document.body.appendChild(editor);

const documentId = 'default-doc';
socket.emit('join', documentId);

editor.addEventListener('input', () => {
    socket.emit('edit', { id: documentId, content: editor.value });
});

socket.on('update', (content) => {
    editor.value = content;
});