import { NextApiRequest, NextApiResponse } from 'next'

const spotifyWebApi = require('spotify-web-api-node')

export default async function handler(req: NextApiRequest,res: NextApiResponse){

    console.log('yeah ...')

    const refreshToken = req.body._refreshToken;
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: '0c064b242e744e0ca6d6dbbc5458c704',
        clientSecret: 'c3395ad6266840c39692fe0cda0ff84c',
        refreshToken
    })

    spotifyApi.refreshAccessToken().then((data: any)=>{
        console.log(data.body)
        res.json({
            accessToken: data.body.accessToken,
            expiresIn: data.body.expiresIn
        })
    }).catch((err: any)=>{
        //console.log('error', err)
        res.status(400).json(err)
    })
}