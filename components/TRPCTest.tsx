import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { trpc } from '@/lib/trpc';

export default function TRPCTest() {
  const [name, setName] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const hiMutation = trpc.example.hi.useMutation({
    onSuccess: (data) => {
      setResult(`Hello ${data.hello}! Server timestamp: ${data.timestamp}`);
    },
    onError: (error) => {
      setResult(`Error: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    if (name.trim()) {
      hiMutation.mutate({ name: name.trim() });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>tRPC Test</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit}
        disabled={hiMutation.isPending}
      >
        <Text style={styles.buttonText}>
          {hiMutation.isPending ? 'Loading...' : 'Say Hi'}
        </Text>
      </TouchableOpacity>
      {result ? <Text style={styles.result}>{result}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '100%',
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});