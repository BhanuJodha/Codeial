const warning = (msg) =>{
    new Noty({
        theme: "relax",
        text: msg,
        type: "warning",
        layout: "topRight",
        timeout: 1500
    }).show();
}

const success = (msg) =>{
    new Noty({
        theme: "relax",
        text: msg,
        type: "success",
        layout: "topRight",
        timeout: 1500
    }).show();
}

const error = (msg) => {
    new Noty({
        theme: "relax",
        text: msg,
        type: "error",
        layout: "topRight",
        timeout: 2000
    }).show();
}
