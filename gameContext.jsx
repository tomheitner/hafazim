import { createContext, useState } from "react";

export const GameContext = createContext();

export function GameContextProvider({ children }) {
    const [boardState, setBoardState] = useState({});
    const [players, setPlayers] = useState([]);
    const [ataPlayerNumber, setAtaPlayerNumber] = useState(null);
    const [roomId, setRoomId] = useState(null);

    return (
        <GameContext.Provider value={{
            boardState: boardState,
            setBoardState: setBoardState,
            players: players,
            setPlayers: setPlayers,
            ataPlayerNumber: ataPlayerNumber,
            setAtaPlayerNumber: setAtaPlayerNumber,
            roomId: roomId,
            setRoomId: setRoomId,
        }
        }>
            {children}
        </GameContext.Provider>
    )
}