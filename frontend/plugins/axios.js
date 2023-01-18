export default function ({app, $axios, store}) {
  $axios.onRequest(config => {
    console.log(config.method, ':', config.url, config.data)
    return config;
  })

  $axios.onResponse(res=>console.log(res.config.url, res.data))

  $axios.onError(error => {
    if (error.response) {
      if(error.response.status !== 401) {
        //console.log(error.response)
        try {
          error.response.data.status = error.response.status;
        }catch (e) {
          error.response.data = error.response
          error.response.data.message = error.response.request.responseText + ': ' + error.response.config.url + ' '
        }
        console.error(error.response.data)
        if(error.response.status === 413){
          store.commit('setSnackBar', {status: 413, message: 'Загружаемый файл превышает допустимый размер'})
        }else{
          store.commit('setSnackBar', error.response.data)
        }

      }

    }else{
      console.error('STRANGE error.response', error)
    }
    return true;
  })
}
