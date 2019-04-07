const { OAuth2Client } = require('google-auth-library');
const clientId = process.env.CLIENT_ID
const client = new OAuth2Client(clientId);

module.exports = (id_token) => {
  return new Promise ((resolve, reject) => {
    client.verifyIdToken({
      idToken: id_token,
      audience: clientId,
    })
    .then(ticket => {
      const payload = ticket.getPayload()
      resolve(payload);
    })
    .catch(err => {
      reject(err);
    })
  })
}