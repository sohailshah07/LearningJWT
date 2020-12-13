require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');
let refreshTokens = [];

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) res.sendStatus(401);
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.sendStatus(403);
                const accessToken = generateAccessToken({ name: user.name });
                res.json({ accessToken: accessToken });
                
            })
    })

app.delete('/logout', (req, res)=>{
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})
app.post('/login',(req, res)=>{
    // authenticate user 
    const userName = req.body.userName;
    const user = {name: userName};

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken)
    res.json({accessToken: accessToken, refreshToken: refreshToken});
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s' })
}
app.listen (4000, ()=> console.log('server up and running at port 4000'));
