const queue = require("../config/kue");

const postMailer = require("../mailers/post_mailer");

queue.process("newPost", (job, done) => {
    console.log("new post worker execute", job.data);
    postMailer.newPost(job.data);
    done();
})

queue.process("deletePost", (job, done) => {
    console.log("delete post worker execute", job.data);
    postMailer.deletePost(job.data);
    done();
})

module.exports = queue;