import axios from 'axios';

const BASE_URL = 'https://api.thecatapi.com/v1/breeds';
const API_KEY =
  'live_1BhCbAxOfyNpYIgTYCWiXZS6lDLk1jq88WQSVrpMPuPstv7Ox0sVSsaxQgcHHrTK';

axios.defaults.headers.common['x-api-key'] = API_KEY;

export function fetchBreeds() {
  showLoader();

  return axios
    .get(BASE_URL)
    .then(response => {
      hideLoader();
      return response.data;
    })
    .catch(error => {
      showError();
      console.error('Error fetching cat breeds:', error);
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
      showError();
      console.error('Error fetching cat data by breed:', error);
      throw error;
    });
}

function showLoader() {
  const loader = document.querySelector('.loader');
  loader.classList.add('visible');
}

function hideLoader() {
  const loader = document.querySelector('.loader');
  loader.classList.remove('visible');
}

function showError() {
  const errorElement = document.querySelector('.error');
  errorElement.classList.add('visible');
}

function hideError() {
  const errorElement = document.querySelector('.error');
  errorElement.classList.remove('visible');
}
