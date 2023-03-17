require('dotenv').config({path: ".env"})

const TYPE = process.env.TYPE
const PROJECT_ID = process.env.PROJECT_ID
const PRIVATE_KEY_ID = process.env.PRIVATE_KEY_ID
const PRIVATE_KEY = process.env.PRIVATE_KEY
const CLIENT_EMAIL = process.env.CLIENT_EMAIL
const CLIENT_ID = process.env.CLIENT_ID
const AUTH_URI = process.env.AUTH_URI
const TOKEN_URI = process.env.TOKEN_URI
const AUTH_PROVIDER_X509_CERT_URL = process.env.AUTH_PROVIDER_X509_CERT_URL
const CLIENT_X509_CERT_URL = process.env.CLIENT_X509_CERT_URL

const fs = require('fs'); 

let googleKey = {
    type: TYPE,
    project_id: PROJECT_ID,
    private_key_id: PRIVATE_KEY_ID,
    private_key: PRIVATE_KEY,
    client_email: CLIENT_EMAIL,
    client_id: CLIENT_ID,
    auth_uri: AUTH_URI,
    token_uri: TOKEN_URI,
    auth_provider_x509_cert_url: AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: CLIENT_X509_CERT_URL,
}

fs.writeFile('google-key.json', JSON.stringify(googleKey),'utf8', (err) => { 
    if (err) throw err; 
    console.log('Goole Key:        ok!'); 
}); 
