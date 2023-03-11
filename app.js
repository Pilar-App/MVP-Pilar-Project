
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

main();