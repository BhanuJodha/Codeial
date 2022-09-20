const queue = require("../config/kue");

const commentMailer = require("../mailers/comment_mailer");

queue.process("newComment", (job, done) => {
    console.log("new comment worker execute", job.data);
    commentMailer.newComment(job.data);
    done();
})

queue.process("deleteComment", (job, done) => {
    console.log("delete comment worker execute", job.data);
    commentMailer.deleteComment(job.data);
    done();
})

module.exports = queue;