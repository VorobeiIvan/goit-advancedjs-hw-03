import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import iziToast from 'izitoast';

document.addEventListener('DOMContentLoaded', function () {
  const elements = {
    breedSelect: document.querySelector('.breed-select'),
    catInfo: document.querySelector('.cat-info'),
    loader: document.querySelector('.loader'),
  };

  const slimSelect = new SlimSelect({
    select: elements.breedSelect,
    placeholder: 'Select a breed',
    showSearch: true,
    searchText: 'No matches found',
    searchPlaceholder: 'Search...',
    searchHighlight: true,
    searchFocus: true,
    allowDeselect: false,
    onChange: handleBreedSelectChange,
  });

  function handleBreedSelectChange() {
    const selectedBreedId = slimSelect.selected();

    if (selectedBreedId) {
      showLoader();
    }

    fetchCatByBreed(selectedBreedId)
      .then(displayCatInfo)
      .catch(error => handleError(error))
      .finally(() => {
        if (selectedBreedId) {
          hideLoader();
          showSlimSelect();
        }
      });
  }

  function displayCatInfo(catData) {
    elements.catInfo.innerHTML = createMarkup(catData);
  }

  function serviceCatSearch() {
    showLoader();

    return fetchBreeds()
      .then(displayBreeds)
      .catch(error => handleError(error))
      .finally(() => {
        hideLoader();
        showSlimSelect();
      });
  }

  function displayBreeds(data) {
    slimSelect.setData(
      data.map(catBreed => ({ text: catBreed.name, value: catBreed.id }))
    );
  }

  function createMarkup(catData) {
    return catData
      .map(({ url, breeds }) => {
        const [firstBreed] = breeds;

        return `
          <img src="${url}" alt="${firstBreed.name}" width="300">
          <div>
            <h3>${firstBreed.name}</h3>
            <p><strong>Description:</strong> ${firstBreed.description}</p>
            <p><strong>Temperament:</strong> ${firstBreed.temperament}</p>
          </div>
        `;
      })
      .join('');
  }

  function showLoader() {
    const loader = document.querySelector('.loader');
    loader.style.display = 'block';
  }

  function hideLoader() {
    const loader = document.querySelector('.loader');
    loader.style.display = 'none';
  }

  function showSlimSelect() {
    slimSelect.slim.container.style.display = 'block';
  }

  function handleError(error) {
    console.error('Error:', error);
    showError('Oops! Something went wrong! Try reloading the page!');
  }

  function showError(message) {
    iziToast.error({
      title: 'Error',
      message: message,
      position: 'topRight',
    });
  }

  serviceCatSearch();
});
