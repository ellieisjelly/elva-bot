import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption, SlashOptionResult } from "discordx";
import { replyEphemeral } from "../utils.js";

@Discord()
export class Link {
    @Slash({ description: "Associe sua conta do Discord ao Minecraft" })
    async link(
        @SlashOption({
            name: "código",
            description: "Código recebido do commando /link no Minecraft",
            required: true,
            type: ApplicationCommandOptionType.String
        })
        code: SlashOptionResult[ApplicationCommandOptionType.String],
        interaction: CommandInteraction) {
            await replyEphemeral(interaction, "Não implementado.")
    }
}