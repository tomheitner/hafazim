import { useEffect } from "react";

export default function SocketListeners({socket}) {
    useEffect(() => {
        // --SERVER LISTENERS--
        socket.on('add_chips', data => {
            console.log(data);
        });


        return () => {
            socket.off('add_chips');
        }
    }, [])

    return (
        <></>
    )
}