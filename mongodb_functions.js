
const {MongoClient} = require('mongodb');
const db_uri = "mongodb://localhost:27017/api";
const client = new MongoClient(db_uri);

async function main(){
    try{
        await client.connect();
        //await databaseList(client);
        //await createListing(client,{name:"user",id:"55"});
        // await createListings(client,[
        //     {
        //         name:"Root",
        //         id:"0",
        //         work:"superuser"
        //     },
        //     {
        //         name:"Willam",
        //         id:"34",
        //         carrer:"Actor"
        //     },
        //     {
        //         name:"Zeek",
        //         id:"5",
        //         titan_name:"Beast Titan"
        //     },
        //     {
        //         name:"Robert",
        //         id:"6",
        //         location:"fantasy"
        //     },
        //     {
        //         name:"Jack",
        //         id:"3",
        //         summary:"Just a regular guy"
        //     },
        // ])
        //await findOneListByName(client,"Root")
        // await findManyListingsWithCErtainCondtions(client,{
        //     maxNumResults:3,
        //     minNumBathrooms:3,
        //     minNumBedrooms:1,
        // })
        //await updateListingByName(client,"Root",{location:"Linux Systems",id:777})
        //await upsertListingByName(client,"Jake",{name:"Jack The Ripper",id:4,Job:"Magic Knight Squad Captian"})
    
        await updateListings(client);
        //await deleteOneListingByName(client,"Robert")
        //await deleteListngsBeforeDate(client,new Date("2019-2-15"))
    }catch(e){
        console.error(e);
    }finally{
        await client.close();
    }
}

async function deleteListngsBeforeDate(client,date) {
    const result = await client.db('api').collection('data').deleteMany({
        "last_scraped":{$lte:date}});
    console.log(`${result.deletedCount} document(s) was/were deleted`)
}

async function deleteOneListingByName(client,nameOfListing) {
    const result = await client.db('api').collection('data').deleteOne({name:nameOfListing});
    console.log(`${result.deletedCount} document(s) was/were deleted`)   
}

async function updateListings(client) {
    const result = await client.db('api').collection('data').updateMany(
        {country:{$exists:false},market:{$exists:false},price:{$exists:false}},
        {$set:{country:"USA",market:"houses",price:854}});
    console.log(`${result.matchedCount} document(s) matched the query criteria`)
    console.log(`${result.matchedCount} document(s) was/were updated`)
}

async function upsertListingByName(client,nameOFListing,updateListing) {
    const result = await client.db('api').collection('data').updateOne({name:nameOFListing},{$set:updateListing},{upsert:true});
    console.log(`${result.matchedCount} document(s) matched the query criteria`);

    if(result.upsertedCount > 0){
        console.log(`One doocument was inserted with the id ${result.insertedId}`)
    }else{
        console.log(`${result.modifiedCount} document(s) was/were updated `);
    }
}

async function updateListingByName(client,nameOFListing,updateListing){
    const result = await client.db('api').collection('data').updateOne({name:nameOFListing},{$set:updateListing});

    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} document(s) was/were modified `);
}

async function findManyListingsWithCErtainCondtions(cilent,{
    minNumBathrooms = 0,
    minNumBedrooms = 0,
    maxNumResults = Number.MAX_SAFE_INTEGER
} = {}){
    const cursor = await client.db('api').collection('data').find({
        id: {$gte: minNumBedrooms},
        //bathrooms: {$gte: minNumBathrooms},
    }).sort({id:-1})
    .limit(maxNumResults);
    const results = await cursor.toArray();
    results.forEach(result=>{
        console.log("the results of your query :")
        console.log(result);
    });
}

async function findOneListByName(client,nameOFListing) {
    const result = await client.db('api').collection('data').findOne({name:nameOFListing});
    if(result){
        console.log(`Found Listing with the name ${nameOFListing}`);
        console.log(result)
    }else {console.log(`No listing found with the name ${nameOFListing}`)};    
}

//can be use to populate a database with a json file
async function createListings(client,database,collection,newListings){
    const result = await client.db(`${database}`).collection(`${collection}`).insertMany(newListings);
    console.log(`${result.insertedCount} new listings inserted with the following id(s):`)
    console.log(result.insertedIds)
}

async function createListing(client,database,collection,newListing) {
    const result = await client.db(`${database}`).collection(`${collection}`).insertOne(newListing);
    console.log(`the documment was nserted successfully and assigned with id:${result.insertedId}`)
}

async function databaseList(client){
    const Databases = await client.db().admin().listDatabases();
    console.log('databases :');
    Databases.databases.forEach(db => {
        console.log(`--${db.name}`)
    });
    client.db('api',)
}

module.exports = {updateListingByName,upsertListingByName,updateListings,createListing,createListings,deleteListngsBeforeDate,deleteOneListingByName,findManyListingsWithCErtainCondtions,findOneListByName}
//main().catch(console.error);
