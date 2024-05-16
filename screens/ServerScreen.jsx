import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, Button, FlatList, View } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://192.168.1.190:5000');  // Adjust the URL as needed

export default function ServerSCreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', msg => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    socket.on('response', data => {
      console.log(data);
    });

    return () => {
      socket.off('message');
      socket.off('response');
    };
  }, []);

  const sendMessage = () => {
    socket.send(message);
    setMessage('');
  };

  function sendCustom() {
    socket.emit("add_chips", {chips: 50})
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Text>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messages}
      />
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
      <Button title="Custom" onPress={sendCustom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  messages: {
    flex: 1,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
