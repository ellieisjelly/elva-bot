import { MessageFlags, BaseInteraction, Events, CommandInteraction, User, Guild, EmbedBuilder, ColorResolvable } from "discord.js";
import { GuardFunction } from "discordx";
import { getServerData, Server } from "../db.js";

export function replyEphemeral(interaction: BaseInteraction, message: string) {
    if (interaction.isRepliable()) {
        return interaction.reply({content: message, flags: MessageFlags.Ephemeral})
    }
}

export async function logAction(guild: Guild, title: string, message: string, user: User, color: ColorResolvable = 0xff0000) {
    const data = await getServerData(guild)
    if (data) {
        const logs = await data.getLogChannel(guild)
        if (logs) {
            const embed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({name: user.username, iconURL: user.avatarURL() || undefined})
                .setTitle(title)
                .setDescription(message)
                .setTimestamp()
            if (logs.isSendable()) {
                logs.send({embeds: [embed]})
            }
        }
    }
}

export const IsAdmin: GuardFunction<CommandInteraction> = async (interaction, client, next) => {
    if (interaction.guild !== null) {
        const data = await getServerData(interaction.guild)
        if (data) {
            const role = await data.getAdminRole(interaction.guild);
            if (role) {
                if (role.members.get(interaction.user.id)) {
                    next()
                } else {
                    replyEphemeral(interaction, "Você não é um admin para utilizar isso.")
                }
            }
        }
    }
}
