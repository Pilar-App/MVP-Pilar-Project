
const functions = require('firebase-functions');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');

const express = require('express')
const app = express()

require('dotenv').config()

// Enter your calendar ID below and service account JSON below
const calendarId = process.env.calendarId;

const serviceAccount = {
    "type": process.env.type,
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id,
    "private_key": process.env.private_key,
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": process.env.auth_uri,
    "token_uri": process.env.token_uri,
    "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.client_x509_cert_url
    }; // Starts with {"type": "service_account",...

    // Set up Google Calendar Service account credentials
    const serviceAccountAuth = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');
process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

const timeZone = 'America/Lima';
const timeZoneOffset = '-05:00';

const fireSave = require('./firebaseService');

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function createCalendarEvent (dateTimeStart, dateTimeEnd, appointment_type) {
    return new Promise((resolve, reject) => {
        calendar.events.list({
            auth: serviceAccountAuth, // List events for time period
            calendarId: calendarId,
            timeMin: dateTimeStart.toISOString(),
            timeMax: dateTimeEnd.toISOString()
            }, (err, calendarResponse) => {
            // Check if there is a event already on the Calendar
            if (err || calendarResponse.data.items.length > 0) {
                reject(err || new Error('Requested time conflicts with another appointment'));
            } else {
                // Create event for the requested time period
                calendar.events.insert({ auth: serviceAccountAuth,
                calendarId: calendarId,
                resource: {summary: appointment_type +' Appointment', description: appointment_type,
                    start: {dateTime: dateTimeStart},
                    end: {dateTime: dateTimeEnd}}
                }, (err, event) => {
                    err ? reject(err) : resolve(event);
                }
            );
            }
        }
        );
    }
);
}

// ------------------------- ENDPOINTS ----------------------------------------


// TODO: Crear un servicio para la conexion a firestore de las respuestas del SmallTalck
// app.post('/responses', express.json(), function (req, res) {
    
// }

app.use('/api', require("./routes/api"));

app.get('/', function (req, res) {
    res.send('Ya volviste del bano Marko?')
})

app.post('/webhook', express.json(), function (req, res) {
    const agent = new WebhookClient({ request: req, response: res });
    console.log("Parameters", agent.parameters);
    const appointment_type = agent.parameters.AppointmentType;

    function makeAppointment (agent) {
        const dateTimeStart = new Date(Date.parse(agent.parameters.date.split('T')[0] + 'T' + agent.parameters.time.split('T')[1].split('-')[0] + timeZoneOffset));
        const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));
        const appointmentTimeString = dateTimeStart.toLocaleString(
            'en-US',
            { 
                month: 'long', 
                day: 'numeric', 
                hour: 'numeric', 
                timeZone: timeZone 
            }
        );
        return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type).then(() => {
            agent.add(`Ok! Déjame revisar si se puede agendar en esta horario. ${appointmentTimeString} está perfecto!.`);
        }).catch(() => {
            agent.add(`Lo siento, no se puede agendar la reunión en el horario ${appointmentTimeString}.`);
        });
    }

    function testNameHook(agent){

        const answers = [
            `¡Muy bien! 👏 Espero te encuentres bien hoy,${agent.parameters.person.name}🤩
            Para asegurar la protección de tus datos, debes aceptar la política de privacidad de Google antes de seguir adelante. ¿Estás de acuerdo? 🛡️`,
            `¡Fantástico! 🤩 ${agent.parameters.person.name}, estoy aquí para ayudarte a mejorar tu productividad 🧐
            ¿Podrías confirmar que estás dispuesto a aceptar la política de privacidad de Google para que pueda seguir ayudándote? 🙏`,
            `¡Perfecto, te llamaré ${agent.parameters.person.name}! 🙌
            Para que pueda brindarte un mejor servicio, debes aceptar la política de privacidad de Google. ¿Estás dispuesto a hacerlo? 🤔`,
            `¡Excelente, es un gusto conocerte ${agent.parameters.person.name}! 👍
            Si deseas continuar con nuestra conversación, es necesario que aceptes la política de privacidad de Google. ¿Estás de acuerdo? 😃`
        ]

        console.log('Test Name Hook')
        console.log(agent.parameters.person.name)
    //     const user = {
    //         name: String,
    //         age: Number,
    //         email: String,
    //     }
    
    //     fireSave(user)
    // }
        
        agent.add(answers[getRandomInt(answers.length)])
        
    }
    function testWebHook(agent){
        agent.add(`Estoy enviando este response desde el webhook`)
    }
    
    let intentMap = new Map();
    intentMap.set('Gestion de citas', makeAppointment);
    intentMap.set('TestWebHook', testWebHook);
    intentMap.set('2Nombre_usuario', testNameHook);
    agent.handleRequest(intentMap);
})

app.listen(3000, ()=>{
    console.log('Estamos ejecutando el servidor en el puerto: '+ 3000)
})