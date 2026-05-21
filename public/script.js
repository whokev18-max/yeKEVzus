async function loadPosts(){

    const response = await fetch("/posts");

    const posts = await response.json();

    const feed = document.getElementById("feed");

    feed.innerHTML = "";

    posts.forEach(post => {

        const div = document.createElement("div");

        div.classList.add("post");

        div.innerHTML = `

            ${
                post.image
                ? `
                <img
                class="${post.shape}"
                src="${post.image}">
                `
                : ""
            }

            <p style="color:${post.color}">
                ${post.text}
            </p>

            <small>
                ${new Date(post.createdAt)
                .toLocaleString()}
            </small>

        `;

        feed.appendChild(div);

    });

}

loadPosts();