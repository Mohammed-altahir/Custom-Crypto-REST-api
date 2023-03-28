Stormgain Custom Rest-api

This is a simple api composed of three files:
    - cryptoAPI.js : the data provider
        it makes a call the stormgain api to get the current transfers between two pairs
        you can check the documentation of stormagain public api and customized the endpoint according to your need
        after the call is made the data is saved to a JSON file calld "Crypto.json"

    - mongodb_functions.js : contains functions that operates on mongodb 
        database (CRUD)

    - app.js: the main api 
        This reads "Crypto.json" and apply the functions from "mongodb_functions.js" on it's data in a mongodb database each on a different endpoint
