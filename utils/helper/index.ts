export const millisToMinutesAndSeconds=(millis: number)=> {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
  }

  function dateIsValid(date:number | Date) {
    return !Number.isNaN(new Date(date).getTime());
  }
  

 export const millsecondstoISODateconverter = (_ms: string) =>{
  let _currDateInMillSecs = Date.now();
  let _expiresIn: string | number  = _currDateInMillSecs + (((Number(_ms)*2)-120) * 1000);

  //let _expiresIn: string | number  = _currDateInMillSecs + ((Number(_ms)+60) * 1000);
 
  let returnedDate : Date | string | boolean = new Date(_expiresIn);
  returnedDate = dateIsValid(returnedDate) && returnedDate.toISOString()
  //console.log(returnedDate)

  return returnedDate;

  //return new Date(_expiresIn);
 }
  