const express = require('express');
const Joi = require('joi');
//const { myCryptoAPI } = require('./cryptoAPI');
const app = express()
const {readFile} = require('fs')
const {updateListingByName,upsertListingByName,updateListings,createListing,createListings,deleteListngsBeforeDate,deleteOneListingByName,findManyListingsWithCErtainCondtions,findOneListByName} = require('./mongodb_functions')
const {MongoClient} = require('mongodb');
const db_uri = "mongodb://localhost:27017/api";
const client = new MongoClient(db_uri);
client.connect()

app.use(express.json())
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const genere = [
    {
        id:1,
        name:"Etherium to Bitcoin",
        rating:9.4,
    },
    {
        id:2,
        name:"Bitcoin to Tether",
        rating:9.8,
    },
    {
        id:3,
        name:"Etherium to DAI",
        rating:10.0,
    },
    {
        id:4,
        name:"Bitcoin Cash to Bitcoin",
        rating:7.4,
    },
    {
        id:5,
        name:"LiteCoin to Tether",
        rating:9.9,
    },
];


app.get('/exchanges', (req, res) => {
    res.send(genere)
    res.sendFile('Crypto.json')

});



app.get('/exchanges/:id', (req, res) => {
  
  const genre = genere.find(g => g.id == parseInt(req.params.id) );
  if(!genre) return res.status(404).send('selected genre not found');
  let obj = [];
  obj.push(genre);
  //createListings(client,,obj);
  res.send(obj);
        
});



app.post('/exchanges/', (req, res)=>{
  const {error} = validation(req.body);
  if(error) return res.status(400).send(error.details[0].message)
  const genre = {
      id: genere.length+1,
      name: req.body.name,
      rating: req.body.rating,
  } ;
  genere.push(genre);   
  createListing(client,`${req.body.name}`,"ETHERIUM EXCHANGES",genre);
  console.log('DATA SAVED SUCCESSFULLY TO THE DATABASE');
  res.send(genre);
});

app.post('/exchanges/many', (req, res)=>{
    let result = []
    
    Object(req.body).forEach(object =>{
        const {error} = validation(object);
        if(error) return res.status(400).send(error.details[0].message)
        const genre = {
            id: genere.length+1,
            name: object.name,
            rating: object.rating,
        } ;
        
        genere.push(genre);
        result.push(genre)    
    })  
    res.send(result);
    createListings(client,`${req.body.name}`,"ETHERIUM EXCHANGES",result);
    console.log('DATA SAVED SUCCESSFULLY TO THE DATABASE');
});

app.put('/exchanges/:id', (req, res) => {
    
    const genre = genere.find(g => g.id == parseInt(req.params.id) );
    if(!genre) return res.status(404).send('selected genre not found');

    const {error} = validation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
    genre.rating = req.body.rating;
    updateListingByName(client,"Etherium to DAI",genre)
    res.send(genre)
});

// app.put('/exchanges/Many/', (req, res) => {

//     let result = [];
//     (req.body).forEach(req,res =>{   
//             const genre = genere.find(g => {g.id == parseInt(req.params.id)} );
//             if(!genre) return res.status(404).send('selected genre not found');

//             const {error} = validation(object.body);
//             if(error) return res.status(400).send(error.details[0].message);

//             genre.name = req.body.name;
//             genre.rating = req.body.rating;
//             result.push(genre);
//         });
//     updateListingByName(client,"ETHERIUM EXCHANGES",result);
//     res.send(result);
// });


app.delete('/exchanges/:id', (req, res) => {
    const genre = genere.find(g => g.id == parseInt(req.params.id) );
    if(!genre) return res.status(404).send('selected genre not found');

    const index = genere.indexOf(genre);
    genere.splice(index,1);
    res.send(genre);
});

function validation(genre){
    const schema = {
        name:Joi.string().min(3).required(),
        rating:Joi.number().min(1).required()
    };
    
    return Joi.validate(genre,schema);
}

