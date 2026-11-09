import { MessageFlags, BaseInteraction } from "discord.js";

export function replyEphemeral(interaction: BaseInteraction, message: string) {
    if (interaction.isRepliable()) {
        return interaction.reply({content: message, flags: MessageFlags.Ephemeral})
    }
}