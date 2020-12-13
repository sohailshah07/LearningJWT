require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

const jwt= require('jsonwebtoken');

const posts=[
{
    userName: 'ronaldo',
    email: 'cr7@gmail.com',
    title: 'post1'
},
{
    userName: 'messi',
    email: 'leo@gmail.com',
    title: 'post2'
}
]
app.get('/posts',authenticateToken, (req, res)=>{
    res.json(posts.filter(post => post.userName === req.user.name));
})

function authenticateToken(req, res ,next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token==null){
        res.sendStatus(401);
    }
    else{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, user)=>{
            if(err){
                return res.sendStatus(403);
            }
            else {
                req.user=user;
                next();
            }
        })
    }
}
app.listen (3000, ()=> console.log('server up and running at port 3000'));

