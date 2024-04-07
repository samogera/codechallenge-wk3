// Your code here
function fetchMoviesAndDisplay() {
    fetch("http://localhost:3000/films")
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(moviesArray => {
            if (!moviesArray || moviesArray.length === 0) {
                throw new Error('No movies found');
            }
            displayMovies(moviesArray);
            displayMovieDetails(moviesArray[0]);
        })
        .catch(error => {
            console.error('Error fetching or displaying movies:', error);
            
        });
}

fetchMoviesAndDisplay();

function displayMovies(moviesArray) {
    const ul = document.getElementById("films");
    ul.innerHTML = "";
    moviesArray.forEach(movie => {
        const li = document.createElement("li");
        li.className = "film item";
        li.textContent = movie.title;
        li.addEventListener("click", () => displayMovieDetails(movie));
        ul.appendChild(li);
    });
}

function displayMovieDetails(movie) {
    const { title, runtime, description, showtime, capacity, tickets_sold, poster } = movie;
    document.getElementById("title").textContent = title;
    document.getElementById("runtime").textContent = `${runtime} minutes`;
    document.getElementById("film-info").textContent = description;
    document.getElementById("showtime").textContent = showtime;
    const ticketsRemaining = capacity - tickets_sold; 
    document.getElementById("ticket-num").textContent = ticketsRemaining >= 0 ? ticketsRemaining : 0; // Ensure non-negative ticket count
    document.getElementById("poster").src = poster;
    const buyTicketBtn = document.getElementById("buy-ticket");
    buyTicketBtn.removeEventListener("click", handleTicket);
    buyTicketBtn.addEventListener("click", () => handleTicket(movie));
}

function handleTicket(movie) {
    const span2 = document.getElementById("ticket-num");
    let count = parseInt(span2.textContent);
    if (count > 0) {
        count -= 1;
        span2.textContent = count;

        
        fetch(`http://localhost:3000/films/${movie.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tickets_sold: movie.tickets_sold + 1
            }),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to update ticket sales');
            }
            return res.json();
        })
        .then(updatedMovie => {
            
            movie.tickets_sold = updatedMovie.tickets_sold;
        })
        .catch(error => {
            console.error('Error updating ticket sales:', error);
            
        });
    }
}
