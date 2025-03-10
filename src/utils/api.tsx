import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const unAuthorised=(err:any,logout:any)=>{
  if(err.status===401)
    logout();
}

export async function hashArray(array: string[]): Promise<string> {
  // Step 1: Convert the array to a string
  const inputString = array.join('');

  // Step 2: Encode the string as a Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(inputString);

  // Step 3: Hash the data using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Step 4: Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

