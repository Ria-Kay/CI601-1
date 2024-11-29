window.addEventListener("load", function () {
    document.querySelector("#form").addEventListener("submit", function (evt) {
        evt.preventDefault();

        const query = document.querySelector("#query").value.trim();
        const loading = document.querySelector("#loading");
        const nofounderror = document.querySelector("#nofounderror");
        const error = document.querySelector("#error");
        const target = document.querySelector("#srchtarget");

        // Clear previous results and errors
        nofounderror.style.display = "none";
        error.style.display = "none";
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
        fetch(`/api/proxy?query=${encodeURIComponent(query)}`, {
            method: "GET",
            credentials: "omit", // Prevent cookies from being sent
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
                const items = response.results || []; // Use `items` to store results

                if (items.length > 0) {
                    const gridContainer = document.createElement("div");
                    gridContainer.classList.add("grid-container");

                    // Process each item (limit to 20 results)
                    items.slice(0, 20).forEach((item) => {
                        const gridItem = document.createElement("div");
                        gridItem.classList.add("grid-item");

                        const img = document.createElement("img");
                        const info = document.createElement("div");
                        const title = document.createElement("p");
                        const subtitle = document.createElement("p");
                        const desc = document.createElement("p");

                        // Image
                        img.src = item.image?.small_url || "placeholder.jpg";
                        img.alt = item.name || "Issue Image";

                        // Title
                        title.textContent = item.name || "Unnamed Issue";

                        // Subtitle: Issue Number and Cover Date
                        const issueNumber = item.issue_number ? `#${item.issue_number}` : "Unknown Issue Number";
                        const coverDate = item.cover_date || "Unknown Cover Date";
                        subtitle.textContent = `Issue ${issueNumber}, Cover Date: ${coverDate}`;

                        // Description
                        desc.textContent = item.description || "No description available.";

                        // Add optional fields like volume and first appearances
                        const optionalInfo = document.createElement("div");

                        // Volume
                        if (item.volume?.name) {
                            const volumeInfo = document.createElement("p");
                            volumeInfo.textContent = `Volume: ${item.volume.name}`;
                            optionalInfo.appendChild(volumeInfo);
                        }

                        // First Appearance Characters
                        if (item.first_appearance_characters?.length > 0) {
                            const characters = item.first_appearance_characters.map((char) => char.name).join(", ");
                            const charInfo = document.createElement("p");
                            charInfo.textContent = `First Appearance Characters: ${characters}`;
                            optionalInfo.appendChild(charInfo);
                        }

                        // First Appearance Teams
                        if (item.first_appearance_teams?.length > 0) {
                            const teams = item.first_appearance_teams.map((team) => team.name).join(", ");
                            const teamInfo = document.createElement("p");
                            teamInfo.textContent = `First Appearance Teams: ${teams}`;
                            optionalInfo.appendChild(teamInfo);
                        }

                        // Story Arcs
                        if (item.story_arc_credits?.length > 0) {
                            const arcs = item.story_arc_credits.map((arc) => arc.name).join(", ");
                            const arcsInfo = document.createElement("p");
                            arcsInfo.textContent = `Story Arcs: ${arcs}`;
                            optionalInfo.appendChild(arcsInfo);
                        }

                        // Build info block
                        info.classList.add("info");
                        info.appendChild(title);
                        info.appendChild(subtitle);
                        info.appendChild(desc);
                        info.appendChild(optionalInfo);

                        // Add elements to grid item
                        gridItem.appendChild(img);
                        gridItem.appendChild(info);
                        gridContainer.appendChild(gridItem);

                        // Add click event to display detailed view
                        img.addEventListener("click", () => {
                            const imgselected = document.querySelector("#imgselected");
                            imgselected.appendChild(info);
                            imgselected.style.display = "block";
                            info.style.display = "block";
                            img.style.width = "80%";
                            info.scrollIntoView();
                        });
                    });

                    // Append the grid container to the target
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
                error.textContent = "Failed to fetch data. Please try again.";
            });
    });

    // Add "back" button functionality
    const back = document.querySelector("#back");
    back.addEventListener("click", () => {
        const imgselected = document.querySelector("#imgselected");
        imgselected.style.display = "none";
        imgselected.innerHTML = ""; // Clear the detailed view
    });
});
