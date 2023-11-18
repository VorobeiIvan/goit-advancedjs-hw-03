import {
  fetchBreeds,
  fetchCatByBreed,
  showLoader,
  hideLoader,
  handleError,
} from './cat-api.js';

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

  elements.breedSelect.addEventListener('change', handleBreedSelectChange);

  let errorDisplayed = false;

  function handleBreedSelectChange() {
    const selectedBreedId = slimSelect.selected();

    if (selectedBreedId) {
      showLoader();
    }

    fetchCatByBreed(selectedBreedId)
      .then(displayCatInfo)
      .catch(error => handleError(error, errorDisplayed))
      .finally(() => {
        if (selectedBreedId) {
          hideLoader();
        }
      });
  }

  function displayCatInfo(catData) {
    elements.catInfo.innerHTML = createMarkup(catData);
  }

  function serviceCatSearch() {
    hideLoader();
    errorDisplayed = false;

    showLoader();

    return fetchBreeds()
      .then(displayBreeds)
      .catch(error => handleError(error, errorDisplayed))
      .finally(() => {
        hideLoader();
      });
  }

  function displayBreeds(data) {
    console.log(data);
    elements.breedSelect.innerHTML = '';
    data.forEach(catBreed => {
      const option = document.createElement('option');
      option.value = catBreed.id;
      option.textContent = catBreed.name;
      elements.breedSelect.appendChild(option);
    });

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

  serviceCatSearch();
});
