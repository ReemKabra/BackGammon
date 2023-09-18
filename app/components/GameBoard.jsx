import React, { useState,useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { initializeBoard, isValidMove, makeMove, isCaptureMove } from './GameLogic';
import io from "socket.io-client/dist/socket.io";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Board = () => {
  const socket=io.connect("http://192.168.1.33:3000")
  const boardSize = 8;
  const [user, setUser] = useState("");
  const[FriendName,setFriendName] =useState("") 
  const [roomId, setRoomId] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
const [boardState, setBoardState] = useState(initializeBoard()); 
const GetNames = async () => {
  try {
      const name = await AsyncStorage.getItem('FriendName');
      const username = await AsyncStorage.getItem('username');

      if (!name || !username) {
          console.error('Failed to retrieve one or both names from AsyncStorage.');
          return;
      }

      setFriendName(name);
      setUser(username);

      const computedRoomId = [username, name].sort().join('-');
      setRoomId(computedRoomId);

      console.log('roomid:', computedRoomId);
      socket.emit("joinRoom", username, name);
  } catch (error) {
      console.error('Error in GetNames:', error.message);
  }
};

  const renderToken = (row, col, tileValue) => {
    switch(tileValue) {
        case 1:
            return <View style={[styles.token, styles.whiteToken]} />;
        case 2:
            return <View style={[styles.token, styles.blackToken]} />;
        case 3:
            return <View style={[styles.token, styles.whiteToken, styles.queenToken]} />; // Add some distinct style for the queen
        case 4:
            return <View style={[styles.token, styles.blackToken, styles.queenToken]} />;
        default:
            return null;
    }
};
  const renderTile = (row, col) => {
    const isBlack = (row + col) % 2 === 1;
    const tileColor = isBlack ? 'black' : 'tan';
    const tileValue = boardState[row][col];
    return (
      <TouchableOpacity 
        key={col} 
        style={[styles.tile, { backgroundColor: tileColor }]}
        onPress={() => handleTilePress(row, col, tileValue)}
      >
        {renderToken(row, col, tileValue)}
      </TouchableOpacity>
    );
};
const handleTilePress = (row, col, tileValue) => {
  if (currentTurn !== user) {
      console.log("It isn't your turn");
      return;
  }

  if (selectedToken) {
      if (isValidMove(boardState, selectedToken.row, selectedToken.col, row, col, selectedToken.value)) {
          const newBoard = makeMove(boardState, selectedToken.row, selectedToken.col, row, col);
          console.log("New board2", newBoard);
          setSelectedToken(null);
          socket.emit('move', {
              user: user,
              friend: FriendName,
              moveDetails: { fromRow: selectedToken.row, fromCol: selectedToken.col, toRow: row, toCol: col }
          });
      } else {
          setSelectedToken(null);
      }
  } else {
      setSelectedToken({ row, col, value: tileValue });
  }
};
  const renderRow = (row) => {
    return (
      <View key={row} style={styles.row}>
        {Array.from({ length: boardSize }).map((_, col) => renderTile(row, col))}
      </View>
    );
  };
  useEffect(() => {
    GetNames();

    const onMoveMade = (moveDetails) => {
        console.log('Received move:', moveDetails);
        const newBoard = makeMove(boardState, moveDetails.fromRow, moveDetails.fromCol, moveDetails.toRow, moveDetails.toCol);
        console.log('New Board1:', newBoard);
        setBoardState(prevBoard => makeMove(prevBoard, moveDetails.fromRow, moveDetails.fromCol, moveDetails.toRow, moveDetails.toCol));
  
    };

    const onYourTurn = (player) => {
        setCurrentTurn(player);
        if (player === user) {
            console.log("It's", user, "turn");
        }
    };

    // Add listeners
    socket.on('moveMade', onMoveMade);
    socket.on('yourTurn', onYourTurn);

    // Cleanup: Remove listeners
    return () => {
        socket.off('moveMade', onMoveMade);
        socket.off('yourTurn', onYourTurn);
    };
}, []);  // Empty dependency array to ensure this useEffect runs only once

  return (
    <View style={styles.board}>
      {Array.from({ length: boardSize }).map((_, row) => renderRow(row))}
    </View>
  );
};
const styles = StyleSheet.create({
  board: {
    width: 320,
    height: 320,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  token: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  whiteToken: {
    backgroundColor: 'white',
  },
  blackToken: {
    backgroundColor: '#444',  // Lighter shade of black
    borderColor: 'white', // Optional white border for visibility
    borderWidth: 1, // Optional white border for visibility
  },
  queenToken: {
    backgroundColor: 'cyan',  // Lighter shade of black
  },
});
export default Board;