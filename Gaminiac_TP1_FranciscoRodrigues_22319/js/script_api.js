// ----------------------------------- Spotify API --------------------------------------------

// Obtain access token for Spotify API using client credentials flow
const clientId = '2a690569157e451187c2e721837223bd';
const clientSecret = 'a2be028f7c8c4b798329d3f5d2b47205';
const basicAuth = btoa(`${clientId}:${clientSecret}`);

let accessToken = '';


fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    Authorization: `Basic ${basicAuth}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'grant_type=client_credentials',
})
  .then((response) => response.json())
  .then((data) => {
    accessToken = data.access_token;
    getCategories();
  })
  .catch((error) => console.log(`Error: ${error}`));

// Get list of all available categories and their playlists
function getCategories() {
  fetch('https://api.spotify.com/v1/browse/categories', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const categories = data.categories.items;
      displayCategoryList(categories);
      console.log(data.categories)
    })
    .catch((error) => console.log(`Error: ${error}`));

}

// Display dropdown select element with list of available categories
function displayCategoryList(categories) {
  const selectElement = document.createElement('select');
  selectElement.setAttribute('id', 'categoryList');
  categories.forEach((category) => {
    const optionElement = document.createElement('option');
    optionElement.setAttribute('value', category.id);
    optionElement.textContent = category.name;
    selectElement.appendChild(optionElement);
  });
  const formElement = document.getElementById('form');
  formElement.appendChild(selectElement);
  const buttonElement = document.createElement('button');
  buttonElement.textContent = 'Get recommended playlists';
  formElement.appendChild(buttonElement);
  buttonElement.addEventListener('click', handleFormSubmit);
}

// Handle form submission by making a GET request to the Spotify API and displaying recommended playlists
function handleFormSubmit(event) {
  event.preventDefault();
  const selectedCategoryId = document.getElementById('categoryList').value;
  // Remove previous pagination bar
  const recommendedPlaylistsContainer = document.getElementById('recommendedPlaylists');
  const prevBar = document.getElementById('paginationBarContainer').innerHTML = '';
  console.log(accessToken);
  fetch(`https://api.spotify.com/v1/browse/categories/${selectedCategoryId}/playlists`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const recommendedPlaylists = data.playlists.items;
      const recommendedPlaylistsContainer = document.getElementById('recommendedPlaylists');
      recommendedPlaylistsContainer.innerHTML = ''; // clear any previous content
      const itemsPerPage = 5;
      let currentPage = 1;
      const totalItems = recommendedPlaylists.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const paginationBarContainer = document.getElementById('paginationBarContainer');

      function displayPlaylists(offset) {
        recommendedPlaylistsContainer.innerHTML = ''; // clear any previous content
        const startIndex = (offset - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const displayedPlaylists = recommendedPlaylists.slice(startIndex, endIndex);

        displayedPlaylists.forEach((playlist) => {
          const playlistElement = document.createElement('div');
          playlistElement.classList.add('playlist'); // add the playlist class
          const playlistImage = document.createElement('img');
          playlistImage.src = playlist.images[0].url; // assuming the first image is the album cover
          playlistImage.alt = playlist.name;
          playlistImage.width = 200;
          playlistImage.height = 200;
          playlistElement.appendChild(playlistImage);

          const playlistLink = document.createElement('a');
          playlistLink.href = playlist.external_urls.spotify;
          playlistLink.target = '_blank'; // opens the link in a new tab
          playlistLink.innerText = playlist.name;
          playlistElement.appendChild(playlistLink);

          recommendedPlaylistsContainer.appendChild(playlistElement);
        });
      }

      displayPlaylists(currentPage);

      const paginationBar = document.createElement('div');
      paginationBar.classList.add('pagination-bar');

      const prevButton = document.createElement('button');
      prevButton.innerText = 'Prev';
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener('click', () => {
        currentPage--;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = false;
        displayPlaylists(currentPage);
      });

      const pageIndicator = document.createElement('span');
      pageIndicator.innerText = `Page ${currentPage} of ${totalPages}`;

      const nextButton = document.createElement('button');
      nextButton.innerText = 'Next';
      nextButton.disabled = currentPage === totalPages;
      nextButton.addEventListener('click', () => {
        currentPage++;
        nextButton.disabled = currentPage === totalPages;
        prevButton.disabled = false;
        displayPlaylists(currentPage);
      });

      paginationBar.appendChild(prevButton);
      paginationBar.appendChild(pageIndicator);
      paginationBar.appendChild(nextButton);

      paginationBarContainer.appendChild(paginationBar);

    
    })


    .catch ((error) => {
  console.error(error);
});
}

// ----------------------------------- Riot games API --------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "RGAPI-ddb10c5b-42a3-4043-aaa0-5a4ccec000b2";
  var summonerName = "";
  const inputField = document.getElementById("summoner-name");
  const submitButton = document.getElementById("submit-button");
  const container = document.getElementById("league-data-container");



  submitButton.addEventListener("click", () => {

   
    summonerName = inputField.value;
    const summonerUrl = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`;


    fetch(summonerUrl, { mode: 'cors' })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((summonerData) => {
        console.log(summonerData);
        const encryptedSummonerId = summonerData.id;
        const leagueUrl = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${apiKey}`;

        return fetch(leagueUrl, { mode: 'cors' }).then((response) => {

          return response.json();
        })

      })


      .then((leagueData) => {
        console.log(leagueData);
        // Organize the data in several variables to become easy to use them and display them in the HTML
        const soloqData = leagueData.find((queue) => queue.queueType === "RANKED_SOLO_5x5");
        const flexData = leagueData.find((queue) => queue.queueType === "RANKED_FLEX_SR");

        const soloqTier = soloqData.tier;
        const soloqRank = soloqData.rank;
        const soloqWins = soloqData.wins;
        const soloqLosses = soloqData.losses;
        const soloqLP = soloqData.leaguePoints;
        
        const flexTier = flexData?flexData.tier:'NADAAAAA';
        //const flexRank = flexData.rank;
        //const flexWins = flexData.wins;
        //const flexLosses = flexData.losses;
        //const flexLP = flexData.leaguePoints;

        const html = `
          <br>
          <h2>Ranked Solo Queue</h2>
          <p>Tier: ${soloqTier} ${soloqRank}</p>
          <p>Wins: ${soloqWins}</p>
          <p>Losses: ${soloqLosses}</p>
          <p>League Points: ${soloqLP}</p>
        </div>
        <div>
          <h2>Ranked Flex Queue</h2>
          <p>Tier: ${flexTier} }</p>
          </div>
      `;

        container.innerHTML = html;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });
});


// ----------------------------------- Fortnite game API --------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const apiKey = 'a01ab3e6-60eb-4ba0-9837-61b7ef4735e2';
  let username = '';
  let platform = '';
  const inputField = document.getElementById('username');
  const platformDropdown = document.getElementById('platform');
  const submitButton = document.getElementById('submitButton');
  const container = document.getElementById('statsContainer');

  // First API request to retrieve account ID
  const getAccountId = async () => {
    const response = await fetch(`https://fortnite-api.com/v2/stats/br/v2?name=${username}&platform=${platform}`, {
      headers: {
        Authorization: apiKey
      }
    });
    const data = await response.json();
    const accountId = data.data.account.id;
    return accountId;
  };

  submitButton.addEventListener("click", async () => {
    event.preventDefault();
    username = inputField.value;
    platform = platformDropdown.value;

    // Second API request to retrieve stats
    const getPlayerStats = async () => {
      const accountId = await getAccountId();
      const response = await fetch(`https://fortnite-api.com/v2/stats/br/v2/${accountId}`, {
        headers: {
          Authorization: apiKey
        }
      });
      const data = await response.json();
      const stats = data.data.stats;
      const soloStats = stats.all.solo;
      const duoStats = stats.all.duo;
      const squadStats = stats.all.squad;

      const statsHtml = `
        <h2>${username}'s Stats</h2>
        <br>
        <h2>Stats solo</h2>
        <p>Solo wins: ${soloStats.wins}</p>
        <p>Solo kills: ${soloStats.kills}</p>
        <p>Solo deaths: ${soloStats.deaths}</p>
        <p>Solo KD: ${soloStats.kd}</p>
        <br>
        <h2>Stats Duo</h2>
        <p>Duo wins: ${duoStats.wins}</p>
        <p>Duo kills: ${duoStats.kills}</p>
        <p>Duo deaths: ${duoStats.deaths}</p>
        <p>Duo KD: ${duoStats.kd}</p>
        <br>
        <h2>Stats Squad</h2>
        <p>Squad wins: ${squadStats.wins}</p>
        <p>Squad kills: ${squadStats.kills}</p>
        <p>Squad deaths: ${squadStats.deaths}</p>
        <p>Squad KD: ${squadStats.kd}</p>
      `;
      container.innerHTML = statsHtml;
    };
    getPlayerStats();
  });
});




/*
const clientId = '2a690569157e451187c2e721837223bd';
const clientSecret = 'a2be028f7c8c4b798329d3f5d2b47205';

// Obtain access token
const getToken = async () => {
    const basicAuth = btoa(`${clientId}:${clientSecret}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });
    const data = await response.json();
    console.log(data.access_token);
    return data.access_token;
    
};

// Use access token to show the available genre playlists


// Use access token to get recommended playlists
async function getRecommendedPlaylists(genres) {
    const accessToken = await getToken();
  
    const limit = 10;
    const url = `https://api.spotify.com/v1/recommendations?limit=${limit}&seed_genres=${genres}`;
  
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const jsonResponse = await response.json();
  
    return jsonResponse.tracks.map((track) => {
      return {
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(', '),
        album: track.album.name,
      };
    });
  }

// Create list of recommended playlists and display them on HTML page
async function displayRecommendedPlaylists() {
    const genres = document.getElementById('genres').value.split(',');
    const playlists = await getRecommendedPlaylists(genres);
  
    const playlistContainer = document.getElementById('playlists');
    playlistContainer.innerHTML = '';
  
    playlists.forEach((playlist) => {
      const playlistDiv = document.createElement('div');
      playlistDiv.className = 'playlist';
  
  
      const name = document.createElement('p');
      name.textContent = playlist.name;
  
      playlistDiv.appendChild(name);
      playlistContainer.appendChild(playlistDiv);
    });
  }


const submitBtn = document.getElementById('submit-btn');
submitBtn.addEventListener('click', async () => {
  const genres = document.getElementById('genres').value;
  const playlists = await getRecommendedPlaylists(genres);
  displayRecommendedPlaylists(playlists);
});

*/
