import { Guild } from "discord.js";
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
    mcUsers: [user],
}, {
    methods: {
        async getAdminRole(guild: Guild) {
            const data = this;
            if (data) {
                return guild.roles.fetch(data.adminRole)
            }
            return null;
        },
        async getReviewerRole(guild: Guild) {
            const data = this;
            if (data && data.reviewerRole) {
                return guild.roles.fetch(data.reviewerRole)
            }
            return null;
        },
        async getLogChannel(guild: Guild) {
            const data = this;
            if (data && data.logChannel) {
                return guild.channels.fetch(data.logChannel)
            }
            return null;
        },
        async getFormEvalChannel(guild: Guild) {
            const data = this;
            if (data && data.formEvalChannel) {
                return guild.channels.fetch(data.formEvalChannel)
            }
            return null;
        }
    }
});
const Server = mongoose.model("Server", server);

export async function getServerData(guild: Guild) {
    return await Server.findOne().where("serverId").equals(guild.id)
}

export async function createServer(serverObj: {serverId: string, adminRole: string, reviewerRole: string, logChannel: string, formEvalChannel: string}) {
    const boob = new Server({serverId: serverObj.serverId, adminRole: serverObj.adminRole, reviewerRole: serverObj.reviewerRole, logChannel: serverObj.logChannel, formEvalChannel: serverObj.formEvalChannel, mcUsers: []})
    await boob.save()
}
export { Server };

