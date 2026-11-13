import { ApplicationCommandOptionType, CommandInteraction, InteractionCallback, PermissionsBitField } from "discord.js";
import {
	Discord,
	Slash,
	SlashOption,
	SlashOptionResult,
} from "discordx";
import { replyEphemeral } from "./utils.js";
import { createServer } from "../db.js";

@Discord()
export class Config {
	@Slash({ description: "Configuração do bot" })
	async config(
		@SlashOption({
			name: "cargo_admin",
			description: "Cargo de Admin",
			required: true,
			type: ApplicationCommandOptionType.Role,
		})
		adminRole: SlashOptionResult[ApplicationCommandOptionType.Role],
		@SlashOption({
			name: "cargo_reviewer",
			description: "Cargo para avaliador de formulario",
			required: true,
			type: ApplicationCommandOptionType.Role,
		})
		reviewerRole: SlashOptionResult[ApplicationCommandOptionType.Role],
		@SlashOption({
			name: "canal_admin",
			description: "Canal para log de ações admin",
			required: true,
			type: ApplicationCommandOptionType.Channel,
		})
		adminChannel: SlashOptionResult[ApplicationCommandOptionType.Channel],
		@SlashOption({
			name: "canal_review_formulario",
			description: "Canal para review de formularios",
			required: true,
			type: ApplicationCommandOptionType.Channel,
		})
		reviewChannel: SlashOptionResult[ApplicationCommandOptionType.Channel],
		interaction: CommandInteraction,
	) {
		if (interaction.guildId === null || interaction.member === null) {
			await replyEphemeral(
				interaction,
				"Esse comando só pode ser executado em um servidor.",
			);
			return;
		}
        const perms = interaction.member.permissions
        if (typeof perms === "string") return;
        if (!perms.has(PermissionsBitField.Flags.Administrator) || !perms.has(PermissionsBitField.Flags.ManageGuild)) {
            await replyEphemeral(interaction, "Você não tem permissão para executar esse comando.")
            return;
        }
		await createServer({
			serverId: interaction.guildId,
			adminRole: adminRole.id,
			reviewerRole: reviewerRole.id,
			logChannel: adminChannel.id,
			formEvalChannel: reviewChannel.id,
		});
		await replyEphemeral(interaction, "Configuração efetuada.");
	}
}
