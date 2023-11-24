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

  function displayCatInfo(catData) {
    elements.catInfo.innerHTML = createMarkup(catData);
  }

  function handleBreedSelectChange() {
    const selectedBreedId = slimSelect.selected();

    if (selectedBreedId) {
      showLoader();
    }

    fetchCatByBreed(selectedBreedId)
      .then(catData => {
        if (catData && catData.length > 0) {
          displayCatInfo(catData);
        } else {
          showError('No cat data received or empty array!');
        }
      })
      .catch(error => handleError(error))
      .finally(() => {
        if (selectedBreedId) {
          hideLoader();
          showSlimSelect();
        }
      });
  }

  function serviceCatSearch() {
    showLoader();

    return fetchBreeds()
      .then(data => {
        if (data && data.length > 0) {
          displayBreeds(data);
        } else {
          showError('No cat breeds received or empty array!');
        }
      })
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
    elements.loader.style.display = 'block';
  }

  function hideLoader() {
    elements.loader.style.display = 'none';
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
