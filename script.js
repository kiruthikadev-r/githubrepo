let currentPage = 1;
let perPage = 10;

function updatePerPage() {
    currentPage = 1;
    perPage = parseInt(document.getElementById('perPage').value);
}

function getRepositories() {
    const username = document.getElementById('username').value;
    const repoList = document.getElementById('repoList');
    const loader = document.getElementById('loader');

    repoList.innerHTML = '';
    loader.style.display = 'block';

    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(userData => {
            displayUserProfile(userData);

            return fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loader.style.display = 'none';
            totalRepos = data.length;

            if (totalRepos === 0) {
                repoList.innerHTML = '<li>No repositories found</li>';
            } else {
                data.forEach(repo => {
                    displayRepositoryDetails(repo);
                });
            }
        })
        .catch(error => {
            loader.style.display = 'none';
            console.error('Error fetching data:', error);
            repoList.innerHTML = '<li>Error fetching repositories</li>';
        });
}

function searchRepositories() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const repoItems = document.querySelectorAll('#repoList li');

    repoItems.forEach(item => {
        const repoName = item.textContent.toLowerCase();
        if (repoName.includes(searchQuery)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function goToPage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next') {
        currentPage++;
    }

    getRepositories();
}

function displayUserProfile(user) {
    const profileImage = document.getElementById('profileImage');
    const profileName = document.getElementById('profileName');
    const profileLocation = document.getElementById('profileLocation');
    const githubLink = document.getElementById('githubLink');
    const socialLink = document.getElementById('socialLink');

    profileImage.src = user.avatar_url;
    profileName.textContent = user.name || user.login;
    profileLocation.textContent = user.location || 'Location not specified';
    githubLink.href = user.html_url;
    githubLink.textContent = 'GitHub Profile';

    socialLink.href = user.blog || '#';
    socialLink.textContent = 'Social Link';

    document.getElementById('profile').style.display = 'block';
}

function displayRepositoryDetails(repo) {
    const repoList = document.getElementById('repoList');
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-12', 'col-md-6', 'col-lg-4', 'mb-4', 'adding-border');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'h-100');

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body');

    const title = document.createElement('h5');
    title.classList.add('card-title', 'repo-heading');
    title.textContent = repo.name;

    const languageBtnsDiv = document.createElement('div');
    languageBtnsDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2');

    if (repo.language) {
        const languageBtn = document.createElement('button');
        languageBtn.classList.add('btn', 'btn-info', 'btn-sm');
        languageBtn.textContent = repo.language;
        languageBtnsDiv.appendChild(languageBtn);
    }

    const description = document.createElement('p');
    description.classList.add('card-text', 'mb-3');
    description.textContent = repo.description || 'No description available';

    cardBodyDiv.appendChild(title);
    cardBodyDiv.appendChild(description);
    cardBodyDiv.appendChild(languageBtnsDiv);

    cardDiv.appendChild(cardBodyDiv);
    colDiv.appendChild(cardDiv);
    repoList.appendChild(colDiv);

    document.getElementById('repoContainer').style.display = 'block';
}
