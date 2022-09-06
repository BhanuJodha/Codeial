{
    const postForm = $("#post-form");
    const postContainer = $("#post-container");

    // Create a new post
    const createPost = (e) => {
        e.preventDefault();

        $.ajax({
            url: "/post/create",
            type: "post",
            data: postForm.serialize(),
            success: (data) => {
                addPostToDom(data.data.post);
            },
            error: (err) => {
                console.error(err.responseText);
            }
        })
    }

    // Add post to DOM
    const addPostToDom = (data) => {
        let post = $(
            `<div class="card" id="post-${data._id}">
                <div class="info">
                    <img src="/images/profile.webp" alt="">
                    <div>
                        <p>${data.user.name}</p>
                        <p>${new Date(data.createdAt).toDateString()}</p>
                    </div>
                    <a href="/post/delete/${ data._id}">
                        <span class="material-symbols-outlined" id="delete-post">
                            delete
                        </span>
                    </a>
                </div>
                <p class="content">${data.content}</p>
                <form action="/comment/create" method="post" class="comment-post">
                    <input type="text" name="content" placeholder="Write comment here!" required>
                    <input hidden="true" type="text" name="post" value="${data._id}">
                    <button type="submit">Post</button>
                </form>
            </div>`
        );
        postContainer.prepend(post);
        postForm.children("textarea").val("");
    }

    const deletePost = (element) => {
        $.ajax({
            url: element.prop("href"),
            type: "get",
            success: (data)=>{
                $(`#post-${data.data.post_id}`).remove();
            },
            error: (err)=>{console.log(err.responseText)}
        })
    }

    const clickHandler = function(e){
        if (e.target.id === "delete-post"){
            e.preventDefault();
            deletePost($(e.target).parent());
        }
    }

    // Event listener

    postForm.submit(createPost);
    $(document).click(clickHandler);

}