require('./db')()
import express, { Application, Request, Response } from 'express'
import http from "http"
import cors from 'cors'
import ENV from './config'
import router from "./router"
import { errorHandler } from "ts-auth-express"
import { Server } from "socket.io"

const app: Application = express()
const server = http.createServer(app)
const io = new Server(server)
const { APP_PORT } = ENV

app.use(express.json())
app.use(cors())
app.use(errorHandler)

app.get("/",(req: Request, res: Response) => {
    res.send("<h1> Hello World!! </h1>")
})
app.use("/api",router)

/** Socket.io  ***/
import SOCKET_EVENTS from './socket.enum'
import { SocketUser } from './types'

type ArrType = {
    user: SocketUser;
    id: string;
}

let arr: ArrType[] = []

const addUserToArray = ({user,id} : ArrType) => {
	const findUser = arr.find(e=> e.user.username === user.username)
	if(findUser)return
	arr.push({user,id})
}


const removeUserFromArray = (id: string) => {
	arr = arr.filter(e=> e?.id !== id)
}

const getSocketIdFromUserID = (username: string) => {
	return arr.find(e=> e.user.username === username)
}

io.on(SOCKET_EVENTS.connection,(socket) => {
    // console.log(socket.id)
    const id = socket?.id
    // join room
    socket.on(SOCKET_EVENTS.user_online,(data: SocketUser) => {
        addUserToArray({ user: data, id})
        io.emit(SOCKET_EVENTS.activeUsers,arr)
    })
    // send msg 
    socket.on(SOCKET_EVENTS.send_msg,(data) => {
        const recSocketId = getSocketIdFromUserID(data.reciever)
        recSocketId && io.to(recSocketId.id).emit(SOCKET_EVENTS.rec_msg,data)
    })
    // disconnect
    socket.on(SOCKET_EVENTS.disconnect,()=> {
		removeUserFromArray(id)
		io.emit('activeUsers',arr)
	})
})

/** Socket.io  ***/

server.listen(APP_PORT,()=> {
    console.log(`listening on http://localhost:${APP_PORT}`)
})