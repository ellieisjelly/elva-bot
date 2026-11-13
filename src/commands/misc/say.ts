import { ApplicationCommandOptionType, ChannelSelectMenuBuilder, ChannelType, CommandInteraction, LabelBuilder, MessageFlags, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Discord, Guard, ModalComponent, Slash, SlashOption, SlashOptionResult } from "discordx";
import { IsAdmin, logAction, replyEphemeral } from "../../utils.js";

@Discord()
export class Say {
    @ModalComponent()
    async sayModal(interaction: ModalSubmitInteraction) {
        const message = interaction.fields.getTextInputValue("message")
        const channel = interaction.fields.getSelectedChannels("channel", true, [ChannelType.GuildText])?.first()
        await channel?.send(message)
        await replyEphemeral(interaction, "Mensagem falada com sucesso.")
    }

    @Slash({description: "Faça o bot dizer algo!"})
    @Guard(IsAdmin)
    async say(
        @SlashOption({ name: "mensagem", description: "Mensagem para o bot dizer", required: false, type: ApplicationCommandOptionType.String})
        message: SlashOptionResult[ApplicationCommandOptionType.String], 
        @SlashOption({ name: "canal", description: "Canal para dizer essa mensagem", required: false, type: ApplicationCommandOptionType.Channel})
        channel: SlashOptionResult[ApplicationCommandOptionType.Channel],
        interaction: CommandInteraction) {
        if (interaction.guild === null) {
            await replyEphemeral(interaction, "Esse comando deve ser executado em um servidor.")
            return;
        }
        if (message === undefined || message === null) {
            const modal = new ModalBuilder()
            .setCustomId("sayModal")
            .setTitle("Mensagem")
            const msg = new TextInputBuilder()
            .setCustomId("message")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)
            const msgLabel = new LabelBuilder()
            .setLabel("Mensagem")
            .setTextInputComponent(msg)
            const channel = new ChannelSelectMenuBuilder()
            .setCustomId("channel")
            .setMaxValues(1)
            .setMinValues(1)
            .setRequired(true)
            .setChannelTypes(ChannelType.GuildText)
            const channelLabel = new LabelBuilder()
            .setLabel("Canal")
            .setChannelSelectMenuComponent(channel)
            modal.addLabelComponents(msgLabel, channelLabel)
            await interaction.showModal(modal)
            return;
        }
        let sayChannel = channel || interaction.channel
        if (sayChannel === undefined || sayChannel === null || !sayChannel.isSendable()) {
            await replyEphemeral(interaction, "Canal inválido");
            return;
        }
        await sayChannel.send(message)
        await replyEphemeral(interaction, "Mensagem falada com sucesso.")
        await logAction(interaction.guild, "Say utilizado", `Mensagem falada: ${message}\nCanal: <#${sayChannel.id}>`, interaction.user)
    }
}