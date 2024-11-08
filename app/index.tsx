import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const SimpleCommandApp: React.FC = () => {
  const [raspberryPiIp, setRaspberryPiIp] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Load the saved IP address on startup
  useEffect(() => {
    const loadStoredIp = async () => {
      const savedIp = await AsyncStorage.getItem('raspberryPiIp');
      if (savedIp) {
        setRaspberryPiIp(savedIp);
        checkConnection(savedIp);
      }
    };
    loadStoredIp();
  }, []);



  // Function to save the IP address
  const saveIpAddress = async (ip: string) => {
    await AsyncStorage.setItem('raspberryPiIp', ip);
  };

  // Function to check connection status
  const checkConnection = async (ip: string) => {
    try {
      const response = await fetch(`http://${raspberryPiIp}:5000/status`);
      setIsConnected(response.ok);
    } catch (error) {
      setIsConnected(false);
      console.error(error);
    }
  };

  const Turn3DPrinterOn = async () => {
    try {
      const response = await fetch(`http://${raspberryPiIp}:5000/Turn3DPrinterOn`);
      if (response.ok) {
        setIsConnected(true);
        Alert.alert("Connected", "Successfully turned on 3D Printer!");
      } else {
        Alert.alert("Error", "Failed to connect to Raspberry Pi; printer not turned on.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Could not connect to Raspberry Pi.");
      console.error(error);
    }
  };

  const Turn3DPrinterOff = async () => {
    try {
      const response = await fetch(`http://${raspberryPiIp}:5000/Turn3DPrinterOff`);
      if (response.ok) {
        setIsConnected(true);
        Alert.alert("Connected", "Successfully turned off 3D Printer!");
      } else {
        Alert.alert("Error", "Failed to connect to Raspberry Pi; printer not turned off.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Could not connect to Raspberry Pi.");
      console.error(error);
    }
  };

  const handleIpChange = (ip: string) => {
    setRaspberryPiIp(ip);
    saveIpAddress(ip);
    checkConnection(ip);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eli's Lab Network</Text>

      {/* Connection Status */}
      <View style={styles.statusContainer}>
        <TouchableOpacity onPress={() => checkConnection(raspberryPiIp)} style={styles.refreshButton}>
          <Ionicons name="refresh" size={18} color="#ffffff" />
        </TouchableOpacity>
        <View style={[styles.statusIndicator, { backgroundColor: isConnected ? '#4CAF50' : '#FF5252' }]} />
        <Text style={styles.statusText}>{isConnected ? 'Online' : 'Offline'}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Jumpbox's Tailscale IP"
        placeholderTextColor="#AAAAAA"
        value={raspberryPiIp}
        onChangeText={handleIpChange}
      />

      <TouchableOpacity style={styles.button} onPress={Turn3DPrinterOn}>
        <Text style={styles.buttonText}>Turn 3D Printer ON</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.button} onPress={Turn3DPrinterOff}>
        <Text style={styles.buttonText}>Turn 3D Printer OFF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#ffffff',
  },
  input: {
    height: 50,
    borderColor: '#666666',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#ffffff',
    backgroundColor: '#333333',
  },
  button: {
    backgroundColor: '#530053',
    //backgroundColor: '#9C27B0',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  refreshButton: {
    marginRight: 10,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 20,
  },
});

export default SimpleCommandApp;
