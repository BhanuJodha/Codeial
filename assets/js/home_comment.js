{
    const commentForm = $("#comment-form");

    // Create a new comment
    const createComment = (e) => {
        e.preventDefault();

        $.ajax({
            url: "/comment/create",
            type: "post",
            data: commentForm.serialize(),
            success: (data) => {
                success(data.message);
                addCommentToDom(data.data.comment);
            },
            error: (err) => {
                warning(err.responseText);
            }
        })
    }

    // Add Comment to DOM
    const addCommentToDom = (comment) => {
        let newComment = $(
            `<div class="comments" id="comment-${ comment._id}">
            <div class="info">
                <img src="/images/profile.webp" alt="">
                <div>
                    <p>${comment.user.name}</p>
                    <p>${new Date(comment.createdAt).toLocaleString()}</p>
                </div>
                <a href="/comment/delete/${ comment._id}">
                    <span class="material-symbols-outlined" id="delete-comment">
                        delete
                    </span>
                </a>
            </div>
            <p class="content">${comment.content}</p>
            </div>`
        );
        $(`#post-${comment.post}>.comment-container`).prepend(newComment);
        commentForm.children("input[name=content]").val("");
    }

    // Delete comment
    const deleteComment = (element) => {
        $.ajax({
            url: element.prop("href"),
            type: "get",
            success: (data)=>{ 
                success(data.message);
                $(`#comment-${data.data.comment_id}`).remove();
            },
            error: (err)=>{
                warning(err.responseText);
            }
        })
    }

    const clickHandler = function(e){
        if (e.target.id === "delete-comment"){
            e.preventDefault();
            deleteComment($(e.target).parent());
        }
    }

    // Event listener

    commentForm.submit(createComment);
    $(document).click(clickHandler);
}