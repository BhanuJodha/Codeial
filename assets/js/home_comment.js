{
    // Create a new comment
    const createComment = (form) => {
        $.ajax({
            url: "/comment/create",
            type: "post",
            data: form.serialize(),
            success: (data) => {
                success(data.message);
                addCommentToDom(form, data.data.comment);
            },
            error: (err) => {
                warning(err.responseText);
            }
        })
    }

    // Add Comment to DOM
    const addCommentToDom = (form, comment) => {
        let newComment = $(
            `<div class="comments" id="comment-${ comment._id}">
            <div class="info">
                <img src="${comment.user.avatar}" alt="${comment.user.name}">
                <div>
                    <p>${comment.user.name}</p>
                    <p>${new Date(comment.createdAt).toLocaleString()}</p>
                </div>
                <a href="/comment/delete/${ comment._id}">
                    <span class="material-symbols-outlined delete-comment">
                        delete
                    </span>
                </a>
                <a href="/like/?id=${ comment._id}&onModel=Comment">
                    <span class="material-symbols-outlined like">
                        thumb_up
                    </span>
                </a>
                <span class="like-count">
                    0
                </span>
            </div>
            <p class="content">${comment.content}</p>
            </div>`
        );
        $(`#post-${comment.post}>.comment-container`).prepend(newComment);
        form.children("input[name=content]").val("");
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
        let target = e.target;
        if (target.classList[1] === "delete-comment"){
            e.preventDefault();
            deleteComment($(e.target).parent());
        }
    }
    
    const submitHandler = function(e){
        let target = e.target;     
        if (target.id === "comment-form"){
            e.preventDefault();
            createComment($(target));
        } 
    }

    // Event listener
    $(document).click(clickHandler);
    $(document).submit(submitHandler);
}