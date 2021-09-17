export default function ({ $axios }, inject) {
    
    $axios.onRequest(config => {
        if(config.genericApi){
          config.baseURL = process.env.API_URL
        }else{
          config.baseURL = process.env.API_URL+'/clients-api/'
        }
      
    })
  
  }