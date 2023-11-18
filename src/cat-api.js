import axios from 'axios';
import iziToast from 'izitoast';

const BASE_URL = 'https://api.thecatapi.com/v1/breeds';
const API_KEY =
  'live_1BhCbAxOfyNpYIgTYCWiXZS6lDLk1jq88WQSVrpMPuPstv7Ox0sVSsaxQgcHHrTK';

axios.defaults.headers.common['x-api-key'] = API_KEY;

let errorDisplayed = false;
export function fetchBreeds() {
  showLoader();

  return axios
    .get(BASE_URL)
    .then(response => {
      hideLoader();
      return response.data;
    })
    .catch(error => {
      handleError(error);
      throw error;
    });
}

export function fetchCatByBreed(breedId) {
  const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search';
  showLoader();

  return axios
    .get(CAT_API_URL, {
      params: {
        breed_ids: breedId,
      },
    })
    .then(response => {
      hideLoader();
      return response.data;
    })
    .catch(error => {
      handleError(error);
      throw error;
    });
}

export function showLoader() {
  const loader = document.querySelector('.loader');
  loader.style.display = 'block';
}

export function hideLoader() {
  const loader = document.querySelector('.loader');
  loader.style.display = 'none';
}

export function handleError(error) {
  console.error('Error:', error);

  if (!errorDisplayed) {
    showError('Oops! Something went wrong! Try reloading the page!');
    errorDisplayed = true;
  }
}

function showError(message) {
  iziToast.error({
    title: 'Error',
    message: message,
    position: 'topRight',
  });
}
