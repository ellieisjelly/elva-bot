import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	CommandInteraction,
	FileUploadBuilder,
	LabelBuilder,
	MessageActionRowComponentBuilder,
	MessageFlags,
	ModalBuilder,
	ModalSubmitInteraction,
	SectionBuilder,
	SeparatorBuilder,
	SeparatorSpacingSize,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	TextDisplayBuilder,
	TextInputBuilder,
	TextInputStyle,
	ThumbnailBuilder,
} from "discord.js";
import {
	ButtonComponent,
	Discord,
	Guard,
	ModalComponent,
	Slash,
	SlashOption,
	SlashOptionResult,
} from "discordx";
import { IsAdmin, replyEphemeral } from "./utils.js";
import { getServerData } from "../db.js";

@Discord()
export class Form {
	@ButtonComponent({ id: "form-register" })
	async buttonHandler(interaction: ButtonInteraction) {
		await showModal(interaction);
	}

	@ModalComponent()
	async formRegister(interaction: ModalSubmitInteraction) {
		if (interaction.guild) {
			const name = interaction.fields.getTextInputValue("name");
			const desc = interaction.fields.getTextInputValue("desc");
			const img = interaction.fields.getUploadedFiles("img");
			const role = interaction.fields.getStringSelectValues("role");
			const data = await getServerData(interaction.guild);
			if (data) {
				const channel = await data.getFormEvalChannel(
					interaction.guild,
				);
				if (channel && channel.isSendable()) {
					const section = new SectionBuilder();
					const title = new TextDisplayBuilder();
					title.setContent(`## ${name}`);
					const descComponent = new TextDisplayBuilder();
					descComponent.setContent(
						`* Descrição: ${desc}\n* Classe: ${role}\n* Usuario: <@${interaction.user.id}>`,
					);
					const thumbnail = new ThumbnailBuilder();
					thumbnail.setURL(
						img?.first()?.proxyURL ||
							"https://cdn.discordapp.com/embed/avatars/1.png",
					);
					section.addTextDisplayComponents(title, descComponent);
					section.setThumbnailAccessory(thumbnail);
					channel.send({
						flags: MessageFlags.IsComponentsV2,
						components: [section],
					});
					replyEphemeral(
						interaction,
						"Formulario recebido com sucesso.",
					);
				}
			}
		}
	}

	@Slash({ description: "Criar formulario de personagem" })
	@Guard(IsAdmin)
	async criar_formulario(
		@SlashOption({
			description: "Canal para mandar o formulario",
			name: "canal",
			required: false,
			type: ApplicationCommandOptionType.Channel,
		})
		channel: SlashOptionResult[ApplicationCommandOptionType.Channel],
		interaction: CommandInteraction,
	): Promise<void> {
		let formChannel = channel || interaction.channel;
		if (
			formChannel === undefined ||
			formChannel === null ||
			!formChannel.isSendable()
		) {
			await replyEphemeral(interaction, "Canal inválido");
			return;
		}
		if (interaction.guildId === null) {
			await replyEphemeral(
				interaction,
				"Esse comando só pode ser executado em um servidor.",
			);
			return;
		}
		const button = new ButtonBuilder()
			.setLabel("Cadastrar Personagem")
			.setStyle(ButtonStyle.Primary)
			.setCustomId("formRegister");
		const row =
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				button,
			);
		await formChannel.send({
			components: [row],
		});
		await replyEphemeral(interaction, "Formulario de personagem criado!");
	}
}

async function showModal(interaction: ButtonInteraction) {
	const modal = new ModalBuilder()
		.setCustomId("formRegister")
		.setTitle("Formulario de personagem");

	const modalDesc = new TextDisplayBuilder().setContent(
		"## Conte-nos um pouco sobre o seu personagem!\nNosso servidor não compromete na história que queremos contar, por isso, garanta que seu personagem *realmente* se encaixe no mundo em que criamos.\n*Sua ficha será avaliada pela nossa equipe em um prazo de 48 horas, caso seja aprovada, você receberá acesso ao servidor.*",
	);
	const name = new TextInputBuilder()
		.setCustomId("name")
		.setStyle(TextInputStyle.Short);
	const nameLabel = new LabelBuilder()
		.setLabel("Nome do Personagem")
		.setTextInputComponent(name);
	const desc = new TextInputBuilder()
		.setCustomId("desc")
		.setStyle(TextInputStyle.Paragraph);
	const descLabel = new LabelBuilder()
		.setLabel("Descrição do Personagem")
		.setTextInputComponent(desc);
	const img = new FileUploadBuilder()
		.setCustomId("img")
		.setMinValues(0)
		.setMaxValues(1)
		.setRequired(false);
	const role = new StringSelectMenuBuilder()
		.setCustomId("role")
		.addOptions([
			new StringSelectMenuOptionBuilder()
				.setLabel("Orcs")
				.setValue("orcs"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Mago")
				.setValue("mage"),
			new StringSelectMenuOptionBuilder()
				.setLabel("Necromante")
				.setValue("necromant"),
		]);
	const roleLabel = new LabelBuilder()
		.setLabel("Classe do Personagem")
		.setStringSelectMenuComponent(role);
	const imgLabel = new LabelBuilder()
		.setLabel("Imagem do Personagem (Opcional)")
		.setFileUploadComponent(img);

	modal.addTextDisplayComponents(modalDesc);
	modal.addLabelComponents([nameLabel, descLabel, roleLabel, imgLabel]);
	await interaction.showModal(modal);
}
