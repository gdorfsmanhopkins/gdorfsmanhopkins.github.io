fetch("data/IMSO.json")
    .then(response => response.json())
    .then(talks => {

        talks.sort((a,b) =>
            new Date(b.date) - new Date(a.date)
        );

        const gallery = document.getElementById("seminar-gallery");

        talks.forEach(talk => {

            const card = document.createElement("a");
            card.href = talk.url;
            card.target = "_blank";
            card.className = "poster-card";

            card.innerHTML = `
                <img src="${talk.poster}" alt="${talk.title}">
                <div class="poster-overlay">
                    <strong>${talk.speaker}</strong><br>
                    ${talk.title}<br>
                    ${talk.date}
                </div>
            `;

            gallery.appendChild(card);

        });

    });