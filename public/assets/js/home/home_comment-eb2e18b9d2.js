{const a=t=>{$.ajax({url:"/comment/create",type:"post",data:t.serialize(),success:e=>{success(e.message),b(t,e.data.comment)},error:e=>{warning(e.responseText)}})},b=(e,t)=>{var a=$(`<div class="comments" id="comment-${t._id}">
            <div class="info">
                <img src="${t.user.avatar}" alt="${t.user.name}">
                <div>
                    <p>${t.user.name}</p>
                    <p>${new Date(t.createdAt).toLocaleString()}</p>
                </div>
                <a href="/comment/delete/${t._id}">
                    <span class="material-symbols-outlined delete-comment">
                        delete
                    </span>
                </a>
                <a href="/like/?id=${t._id}&onModel=Comment">
                    <span class="material-symbols-outlined like">
                        thumb_up
                    </span>
                </a>
                <span class="like-count">
                    0
                </span>
            </div>
            <p class="content">${t.content}</p>
            </div>`);$(`#post-${t.post}>.comment-container`).prepend(a),e.children("input[name=content]").val("")},c=e=>{$.ajax({url:e.prop("href"),type:"get",success:e=>{success(e.message),$("#comment-"+e.data.comment_id).remove()},error:e=>{warning(e.responseText)}})},d=function(e){"delete-comment"===e.target.classList[1]&&(e.preventDefault(),c($(e.target).parent()))},e=function(e){var t=e.target;"comment-form"===t.id&&(e.preventDefault(),a($(t)))};$(document).click(d),$(document).submit(e)}