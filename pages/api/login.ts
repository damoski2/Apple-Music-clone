
import type { NextApiRequest, NextApiResponse } from 'next'

const spotifyWebApi = require('spotify-web-api-node')

export default async function handler(req: NextApiRequest,res: NextApiResponse){
    const code = req.body.code
    //console.log('code', code)
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '0c064b242e744e0ca6d6dbbc5458c704',
        clientSecret: 'c3395ad6266840c39692fe0cda0ff84c'
    })

    await spotifyApi.authorizationCodeGrant(code).then((data: any)=>{
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    }).catch((error: any)=>{
        console.log('error', error)
        res.status(400).json(error)
    })
}
