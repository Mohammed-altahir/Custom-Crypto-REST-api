const axios = require('axios').default;
const fs = require('fs')

function myCryptoAPI(){
axios({
  method: 'GET',
  url: "https://public-api.stormgain.com/api/v1/cg/spot/pairs",
}).then((res)=>{
  fs.createWriteStream('Crypto.json').write(JSON.stringify((res.data)));
  
});

}
myCryptoAPI()

