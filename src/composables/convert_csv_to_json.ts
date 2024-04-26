const CSVToJSON = (data, delimiter = ',',toNumberField:Array<string>=[]) => {
  const titles = data.slice(0, data.indexOf('\n')).split(delimiter);
  return data
    .slice(data.indexOf('\n') + 1)
    .split('\n')
    .map(v => {
      const values = v.split(delimiter);
      return titles.reduce(
        (obj, title, index) =>{
          title = title.trim()
          let value=values[index]
          if (typeof values[index] ==='string'){
            value = value.replace('\r', '');
          }
          if(toNumberField.includes(title)){
              obj[title] = Number(value);
          }else{
              obj[title] = value;
          }
          return obj;
        },{}
      );
    }).slice(0,-1);
  };
export default CSVToJSON;