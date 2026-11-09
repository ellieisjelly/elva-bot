import mongoose, { Schema } from "mongoose";

await mongoose.connect("mongodb://127.0.0.1:27017/elva-bot")
const user = new Schema({
    discordId: String,
    mcName: String,
    verificationCode: String,
    verified: Boolean
})
const server = new Schema({
    serverId: {
        type: String,
        required: true
    },
    adminRole: {
        type: String,
        required: true
    },
    reviewerRole: String,
    logChannel: String,
    formEvalChannel: String,
    mcUsers: [user]
});
const Server = mongoose.model("Server", server);

export async function getServerData(id: string) {
    return await Server.findOne().where("serverId").equals(id)
}

export async function createServer(serverObj: {serverId: string, adminRole: string, reviewerRole: string, logChannel: string, formEvalChannel: string}) {
    const boob = new Server({serverId: serverObj.serverId, adminRole: serverObj.adminRole, reviewerRole: serverObj.reviewerRole, logChannel: serverObj.logChannel, formEvalChannel: serverObj.formEvalChannel, mcUsers: []})
    await boob.save()
}

