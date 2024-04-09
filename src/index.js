async function fetchMoviesAndDisplay() {
    try {
        const response = await fetch("http://localhost:4000/films");
        if (!response.ok) {
            throw new Error('Failed to fetch movies. Server responded with status: ' + response.status);
        }
        const moviesArray = await response.json();
        if (!moviesArray || moviesArray.length === 0) {
            throw new Error('No movies found.');
        }
        displayMovies(moviesArray);
        displayMovieDetails(moviesArray[0]);
    } catch (error) {
        console.error('Error fetching or displaying movies:', error);
    }
}

fetchMoviesAndDisplay();

function displayMovies(moviesArray) {
    const movieList = document.getElementById("films");
    movieList.innerHTML = "";
    moviesArray.forEach(movie => {
        const listItem = document.createElement("li");
        listItem.className = "film item";
        listItem.textContent = movie.title;
        listItem.addEventListener("click", () => displayMovieDetails(movie));
        movieList.appendChild(listItem);
    });
}

function displayMovieDetails(movie) {
    const { title, runtime, description, showtime, capacity, tickets_sold, poster } = movie;
    document.getElementById("title").textContent = title;
    document.getElementById("runtime").textContent = `${runtime} minutes`;
    document.getElementById("film-info").textContent = description;
    document.getElementById("showtime").textContent = showtime;
    const ticketsRemaining = Math.max(capacity - tickets_sold, 0);
    document.getElementById("ticket-num").textContent = ticketsRemaining;
    document.getElementById("poster").src = poster;
    const buyTicketBtn = document.getElementById("buy-ticket");
    buyTicketBtn.removeEventListener("click", handleTicket);
    buyTicketBtn.addEventListener("click", () => handleTicket(movie));
}

async function handleTicket(movie) {
    try {
        const ticketCountSpan = document.getElementById("ticket-num");
        let ticketCount = parseInt(ticketCountSpan.textContent);
        if (ticketCount > 0) {
            ticketCount--;

            const response = await fetch(`http://localhost:3000/films/${movie.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tickets_sold: movie.tickets_sold + 1
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update ticket sales. Server responded with status: ' + response.status);
            }
            const updatedMovie = await response.json();
            movie.tickets_sold = updatedMovie.tickets_sold;

            ticketCountSpan.textContent = ticketCount; // Update the displayed ticket count
        }
    } catch (error) {
        console.error('Error updating ticket sales:', error);
    }
}


async function handleDelete(movie) {
    try {
        const response = await fetch(`http://localhost:3000/films/${movie.id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error('Failed to delete movie. Server responded with status: ' + response.status);
        }
        const deletedMovieId = await response.json();
        // Remove the deleted movie from the UI
        const listItem = document.querySelector(`.film.item[data-id="${deletedMovieId}"]`);
        if (listItem) {
            listItem.remove();
        }
    } catch (error) {
        console.error('Error deleting movie:', error);
    }
}
