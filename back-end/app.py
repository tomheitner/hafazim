from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins='*')

@app.route('/')
def index():
    return "SocketIO Server"

@socketio.on('message')
def handle_message(msg):
    print(f"Message: {msg}")
    send(msg, broadcast=True)

@socketio.on('custom_event')
def handle_custom_event(data):
    print(f"Custom Event Data: {data}")
    emit('response', {'data': 'Custom event received!'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)
