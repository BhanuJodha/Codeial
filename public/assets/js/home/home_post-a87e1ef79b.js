{const a=$("#post-form"),b=$("#post-container"),c=e=>{e.preventDefault(),$.ajax({url:"/post/create",type:"post",data:a.serialize(),success:e=>{success(e.message),d(e.data.post)},error:e=>{warning(e.responseText)}})},d=e=>{e=$(`<div class="card" id="post-${e._id}">
                <div class="info">
                    <img src="${e.user.avatar}" alt="${e.user.name}">
                    <div>
                        <p>${e.user.name}</p>
                        <p>${new Date(e.createdAt).toDateString()}</p>
                    </div>
                    <a href="/post/delete/${e._id}">
                        <span class="material-symbols-outlined delete-post">
                            delete
                        </span>
                    </a>
                </div>
                <p class="content">${e.content}</p>
                <div class="likes-comments">
                    <a href="/like/?id=${e._id}&onModel=Post">
                        <span class="material-symbols-outlined like">
                            thumb_up
                        </span>
                    </a>   
                    <span class="like-count">
                        0
                    </span>
                    <form action="/comment/create" method="post" class="comment-post" id="comment-form">
                        <input type="text" name="content" placeholder="Write comment here!" required>
                        <input hidden="true" type="text" name="post" value="${e._id}">
                        <button type="submit">Post</button>
                    </form>
                </div>
                <div class="comment-container">
                </div>
            </div>`);b.prepend(e),a.children("textarea").val("")},e=e=>{$.ajax({url:e.prop("href"),type:"get",success:e=>{success(e.message),$("#post-"+e.data.post_id).remove()},error:e=>{warning(e.responseText)}})},f=function(t){"delete-post"===t.target.classList[1]&&(t.preventDefault(),e($(t.target).parent()))};a.submit(c),$(document).click(f)}