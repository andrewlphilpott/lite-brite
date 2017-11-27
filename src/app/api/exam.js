import axios from 'axios';

// Get data
export const fetchStudentStatus = () => {
  const url = `./json/studentStatus.json`
  axios.get(url)
    .then(response => {
      return 'asdf';
    });
}