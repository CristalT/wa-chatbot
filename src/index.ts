import * as fs from 'fs'
import { Client, ClientSession } from 'whatsapp-web.js'
import * as qrcode from 'qrcode-terminal'
import * as path from 'path'

const SESSION_FILE_PATH: string = path.join(__dirname, 'session.json')
let sessionCfg: ClientSession
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH)
}

const client: Client = new Client({ session: sessionCfg })

client.initialize()

client.on('qr', (qr) => {
    // Show QR code on terminal
    qrcode.generate(qr, { small: true })
})

client.on('authenticated', (session) => {
    console.log('Authentication success!')
    sessionCfg = session
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error('Error while saving session file', err)
        }
    })
})

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('Authentication failure', msg)
})

client.on('message', async msg => {
    console.log('Message received', msg)

    if (msg.body == '!ping') {
        // Send a new message to the same chat
        client.sendMessage(msg.from, 'pong')
    }
})
