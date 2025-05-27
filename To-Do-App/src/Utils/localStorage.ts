export function setItem(key: string, value: unknown) {
   try{

      window.localStorage.setItem(key, JSON.stringify(value))

   }catch(error){
      console.log(error);

   }
}

export function getItem(key: string ){
   const item = window.localStorage.getItem(key);
   
   try {
      return item ? JSON.parse(item) : undefined;
   } catch (error) { console.log(error) }

}
