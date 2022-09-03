const router = require('express').Router();
const userData = require('../data.json');
const fs = require('fs');

//get all user
router.get('/all', (req, res)=>{
    res.status(200).send(userData)
})

//get user by id
router.get('/:id',(req, res)=>{
    const id = req.params.id;
    const user = userData.find(user=>user.id === id);
    if(user){
        res.status(200).send(user);
    }else{
        res.status(401).json({message: 'user not found'})
    }
})

//get random user
router.get("/random", (req, res)=>{
    const randomId = Math.round(Math.random()*(userData.length-1) + 1);
    const randomUser = userData.find(user=>parseInt(user.id) === randomId);
    res.status(200).send(randomUser);
})

//post a user
router.post('/',(req, res)=>{
    const newUser = req.body;
    const newUserId = parseInt(Math.floor(newUser.id));
    const existingUser = userData.find(user=>parseInt(user.id) === newUserId);
    if(existingUser){
        res.status(401).json({message: `user id already registered please input more then ${userData.length} as id`})
    }
    if(newUserId !== userData.length+1){
        res.json({message: `new user id is must be ${userData.length+1}`})
    }else{
        userData[newUserId] = newUser;
        console.log(userData)
        fs.writeFileSync('./data.json', JSON.stringify(userData));
        res.status(200).json({message: 'user registered successfully', user: userData[newUserId]})
    }
})

//update an user
router.put('/update',(req, res)=>{
    const {id, contact} = req.body;
    const existingUser = userData.find(user=>parseInt(user.id) === parseInt(Math.floor(id)));
    fs.readFile('./data.json', null, (err, data)=>{
        if(!err){
            existingUser.contact = contact;
            res.send(`contact number with id ${existingUser.id} has been updated`);
        }else{
            res.json({error: err.message});
        }
    }, true);
});

//delete user
router.delete('/delete',(req, res)=>{
    const {id} = req.body;
    const existingUser = userData.find(user=>parseInt(user.id) === parseInt(Math.floor(id)));
    fs.readFile('./data.json', null, (err, data)=>{
        if(!err){
            delete userData[id]
            res.send(`user with id ${existingUser.id} has been deleted`);
        }else{
            res.json({error: err.message});
        }
    }, true);
})

module.exports = router;