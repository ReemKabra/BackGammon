import React, { useState,useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet,Text } from 'react-native';
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
const [userColor, setUserColor] = useState("");
const[qweenColor, setQweenColor] = useState("");
const[gameEnd, setGameEnd]=useState(false);
const[winnerColor, setWinnerColor] = useState("");
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
  let tokenStyle = [styles.token];

  switch (tileValue) {
      case 1:
          tokenStyle.push(styles.whiteToken);
          break;
      case 2:
          tokenStyle.push(styles.blackToken);
          break;
      case 3:
          // Style for white queen
          tokenStyle.push(styles.whiteToken);
          tokenStyle.push(styles.whiteQueenToken);
          break;
      case 4:
          // Style for black queen
          tokenStyle.push(styles.blackToken);
          tokenStyle.push(styles.blackQueenToken);
          break;
      default:
          return null;
  }
  return <View style={tokenStyle} />;
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
  console.log("tileValue:", tileValue);
console.log("userColor:", userColor);
  if (currentTurn !== user) {
      console.log("It isn't your turn");
      return;
  }
  if (tileValue!== userColor&&tileValue!=0 &&tileValue!=qweenColor) {
    setSelectedToken(null);
    console.log("You can only move your own tokens");
    return;
  }
  console.log(selectedToken)
  if (selectedToken) {
    console.log(isValidMove(boardState, selectedToken.row, selectedToken.col, row, col, selectedToken.value));
      if (isValidMove(boardState, selectedToken.row, selectedToken.col, row, col, selectedToken.value)) {
          const newBoard = makeMove(boardState, selectedToken.row, selectedToken.col, row, col);
          console.log("New board2", newBoard);
          setSelectedToken(null);
          socket.emit('move', {
              user: user,
              friend: FriendName,
              moveDetails: { fromRow: selectedToken.row, fromCol: selectedToken.col, toRow: row, toCol: col }
          });
          // if(declareWinner()=="Black"||declareWinner()=="White")
          // {
          //   setGameEnd(true);
          //   setWinnerColor(declareWinner());
          // }
      } else {
          setSelectedToken(null);
      }
  } else {
    if(tileValue!=0)
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
//   const declareWinner = (boardState) => {
//     let whiteCount = 0;
//     let blackCount = 0;

//     // Count the number of white and black pieces on the board
//     for (let row = 0; row < boardState.length; row++) {
//         for (let col = 0; col < boardState[row].length; col++) {
//             const tileValue = boardState[row][col];
//             if (tileValue === 1 || tileValue === 3) {
//                 whiteCount++;
//             } else if (tileValue === 2 || tileValue === 4) {
//                 blackCount++;
//             }
//         }
//     }

//     // Determine the winner based on the counts
//     if (whiteCount === 0) {
//         return "Black"; // Black wins if there are no white pieces left
//     } else if (blackCount === 0) {
//         return "White"; // White wins if there are no black pieces left
//     } else {
//         return "No winner"; // The game is not over yet
//     }
// };

  useEffect(() => {
    GetNames();

    const onMoveMade = (moveDetails) => {
        console.log('Received move:', moveDetails);
        const newBoard = makeMove(boardState, moveDetails.fromRow, moveDetails.fromCol, moveDetails.toRow, moveDetails.toCol);
        console.log('New Board1:', newBoard);
        setBoardState(prevBoard => makeMove(prevBoard, moveDetails.fromRow, moveDetails.fromCol, moveDetails.toRow, moveDetails.toCol));
  
    };

    const onYourTurn =  async (player,assignedColor) => {
      const username = await AsyncStorage.getItem('username');
      console.log('Player:', player);
      console.log('User:', username);
        setCurrentTurn(player);
        if (assignedColor)
        {
          setUserColor(2);
          setQweenColor(4);
        }else{
          setUserColor(1);
          setQweenColor(3);
        }
        if (player === username) {
            console.log("It's", username, "turn");
        }
    };
    socket.on('moveMade', onMoveMade);
    socket.on('yourTurn', onYourTurn);

    return () => {
        socket.off('moveMade', onMoveMade);
        socket.off('yourTurn', onYourTurn);
    };
}, []);  

  return (
    <View style={styles.board}>
     <Text style={[styles.turn, userColor === 1 ? styles.whiteText : styles.blackText]}>
  It's {currentTurn} turn
</Text>
      {Array.from({ length: boardSize }).map((_, row) => renderRow(row))}
    </View>
  );
};
const styles = StyleSheet.create({
  board: {
    width: 500,
    height: 500,
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
  whiteQueenToken: {
    backgroundColor: 'lightblue',  // Change the background color for white queens
},

blackQueenToken: {
    backgroundColor: 'darkred',   // Change the background color for black queens
    borderColor: 'white',        // Optional white border for visibility
    borderWidth: 1,              // Optional white border for visibility
},
whiteText: {
  fontSize: 25,
  color: 'white',
  justifyContent: 'center',
},

blackText: {
  fontSize: 25,
  color: 'black',
  justifyContent: 'center',
},
});
export default Board;