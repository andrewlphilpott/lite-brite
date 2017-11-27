import axios from 'axios';

export let config = {
  "apiUrl": "http://localhost:8011/v1",
  "domain": "http://localhost:3000"
}

export let api = axios.create({
  baseURL: config.apiUrl
});