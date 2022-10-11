{const a=$("#chat-boxes");class b{constructor(e,t){this.messageBox=e,this.authToken=t,this.socket=io.connect("http://localhost:5000",{extraHeaders:{Authorization:"Bearer "+t}}),this.#connectionHandler()}#connectionHandler(){this.socket.on("connect",()=>{console.log("Connection established using socket")}),this.socket.on("new-message",e=>{this.messageBox.prepend(`<li>${e}</li>`)})}sendMessage(e){this.socket.emit("send-message",e)}}const c=e=>{"minimize"===e.text()?(e.text("open_in_full"),e.parent().nextAll().css("display","none")):(e.text("minimize"),e.parent().next().css("display","flex").next().css("display","block"))},d=t=>{t=t.data("person");0===a.children(`.chat-container[data-person='${t}']`).length&&$.ajax({url:"http://127.0.0.1:8000/chat/"+t,type:"get",success:t=>{let s=e(t),a=f(s,t.data.authToken);s.prev().children(".close-chat").click(e=>{s.parent().remove(),a.socket.disconnect(),console.log("Socket disconnected")})},error:e=>{error(e.responseText)}})},e=e=>{var t=$(`<div class='chat-container' data-person='${e.data.person._id}'></div>`),s=(t.html(`
        <div class="chat-header">
            <img src="${e.data.person.avatar}">
            <span class="name">${e.data.person.name.slice(0,20)}</span>
            <span class="material-symbols-outlined toggle-chat">minimize</span>
            <span class="material-symbols-outlined close-chat">
            close
            </span>
        </div>
        `),$("<div class='message'></div>"));for(const n of e.data.messages)n.reciver===e.data.person._id?s.append(`
                    <li class="send">${n.content}</li>
            `):s.append(`
                    <li>${n.content}</li>
            `);return t.append(s),t.append(`
        <div class="send-message">
            <form>
                <textarea name="message" rows="1" placeholder="Type your message here" required></textarea>
                <button type="submit">Send</button>
            </form>
        </div>
        `),a.append(t),s},f=(e,t)=>{let s=new b(e,t);return e.next().children("form").submit(e=>{var t=$(e.target),e=(e.preventDefault(),t.children("textarea").val());s.sendMessage(e),s.messageBox.prepend(`<li class="send">${e}</li>`),t.children("textarea").val("")}),s},g=e=>{"toggle-chat"===e.target.classList[1]?c($(e.target)):"open-chat"===e.target.classList[1]&&(e.preventDefault(),d($(e.target)))};$(document).click(g)}