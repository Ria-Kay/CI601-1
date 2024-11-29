window.addEventListener("load", function () {
    document.querySelector("#form").addEventListener("submit", function (evt) {
        evt.preventDefault();

        const query = document.querySelector("#query").value.trim();
        const loading = document.querySelector("#loading");
        const nofounderror = document.querySelector("#nofounderror");
        const error = document.querySelector("#error");

        // Clear previous errors and results
        nofounderror.style.display = "none";
        error.style.display = "none";
        const target = document.querySelector("#srchtarget");
        while (target.lastChild) {
            target.removeChild(target.lastChild);
        }

        // Prevent empty search queries
        if (!query) {
            loading.style.display = "none";
            nofounderror.style.display = "block";
            nofounderror.textContent = "Please enter a valid search query.";
            return;
        }

        // Show loading indicator
        loading.style.display = "block";

        // Fetch data from server-side proxy
        fetch(`pages/api/proxy?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            credentials: 'omit', // Prevent cookies from being sent
        })
            .then((response) => {
                loading.style.display = "none"; // Hide loading indicator
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to fetch data");
                }
            })
            .then((response) => {
                const issues = response.results || []; // The issues array

                if (issues.length > 0) {
                    const gridContainer = document.createElement("div");
                    gridContainer.classList.add("grid-container");

                    issues.slice(0, 20).forEach((issue) => { // Limit to 20 results
                        const gridItem = document.createElement("div");
                        gridItem.classList.add("grid-item");

                        const img = document.createElement("img");
                        const info = document.createElement("div");
                        const title = document.createElement("p");
                        const time = document.createElement("time");
                        const desc = document.createElement("p");

                        // Add issue image if available
                        img.src = issue.image ? issue.image.small_url : "placeholder.jpg";

                        // Add issue metadata
                        title.textContent = issue.name || "Unnamed Issue";
                        time.textContent = `Release Date: ${issue.cover_date || "Unknown"}`;
                        desc.textContent = issue.description || "No description available.";

                        info.classList.add("info");
                        info.appendChild(title);
                        info.appendChild(time);
                        info.appendChild(desc);

                        gridItem.appendChild(img);
                        gridItem.appendChild(info);
                        gridContainer.appendChild(gridItem);

                        // Add click event to show detailed view
                        img.addEventListener("click", () => {
                            const imgselected = document.querySelector("#imgselected");
                            imgselected.appendChild(info);
                            imgselected.style.display = "block";
                            info.style.display = "block";
                            img.style.width = "80%";
                            info.scrollIntoView();
                        });

                        // Add "back" button functionality
                        const back = document.querySelector("#back");
                        back.addEventListener("click", () => {
                            const imgselected = document.querySelector("#imgselected");
                            imgselected.style.display = "none";
                            info.style.display = "block";
                            gridItem.appendChild(img);
                        });
                    });

                    target.appendChild(gridContainer);
                } else {
                    nofounderror.style.display = "block";
                    nofounderror.textContent = "No issues found. Try a different search query.";
                }
            })
            .catch((err) => {
                console.error("Error:", err.message);
                loading.style.display = "none";
                error.style.display = "block";
                error.textContent = "Failed to fetch data. Please try again later.";
            });
    });
});
