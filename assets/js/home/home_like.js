{
    const toggleLike = (element) => {
        $.ajax({
            url: element.prop("href"),
            type: "get",
            success: (data)=>{ 
                success(data.message);
                element.siblings(".like-count").text(data.data.likes);
            },
            error: (err)=>{
                warning(err.responseText);
            }
        })
    }

    const clickHandler = function(e){
        let target = e.target;
        if (target.classList[1] === "like"){
            e.preventDefault();
            toggleLike($(e.target).parent());
        }
    }

    // Event listener
    $(document).click(clickHandler);
}