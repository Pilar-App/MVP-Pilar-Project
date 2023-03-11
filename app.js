require('dotenv').config({path: ".env"})

import {
    TYPE,
    PROJECT_ID,
    PRIVATE_KEY_ID,
    PRIVATE_KEY,
    CLIENT_EMAIL,
    CLIENT_ID,
    AUTH_URI,
    TOKEN_URI,
    AUTH_PROVIDER_X509_CERT_URL,
    CLIENT_X509_CERT_URL
} from "./token"

const WsProvider = require('@bot-whatsapp/provider/baileys')
const DBProvider = require('@bot-whatsapp/database/mock')
const { createProvider } = require('@bot-whatsapp/bot')
const { createBotDialog } = require('@bot-whatsapp/contexts/dialogflow')

const main = async () => {
    const adapterDB = new DBProvider()
    const adapterProvider = createProvider(WsProvider)


    createBotDialog({
        provider: adapterProvider,
        database: adapterDB,
    })
}
main()