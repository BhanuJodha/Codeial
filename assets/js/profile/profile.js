{
    let toggleFollow = (e) => {
        e.preventDefault();
        let target = $(e.currentTarget);

        $.ajax({
            type: "get",
            url: target.prop("href"),
            success: (data)=> {
                if (target.children().eq(0).text() === "Follow"){
                    target.children().eq(0).text("Unfollow");
                }
                else{
                    target.children().eq(0).text("Follow");
                }
                success(data.message);
            },
            error: (err) => {
                error(err.responseText);
            }
        })
    }

    $("#toggle-follow").click(toggleFollow);
}