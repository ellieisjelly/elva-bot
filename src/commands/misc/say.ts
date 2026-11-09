import { ApplicationCommandOptionType, CommandInteraction, LabelBuilder, MessageFlags, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Discord, ModalComponent, Slash, SlashOption, SlashOptionResult } from "discordx";

@Discord()
export class Say {
    @ModalComponent()
    async sayModal(interaction: ModalSubmitInteraction) {
        const message = interaction.fields.getTextInputValue("message")
        const channel = interaction.fields.getSelectedChannels("channel")
        //channel?.first()
    }

    @Slash({description: "Faça o bot dizer algo!"})
    async say(
        @SlashOption({ name: "mensagem", description: "Mensagem para o bot dizer", required: false, type: ApplicationCommandOptionType.String})
        message: SlashOptionResult[ApplicationCommandOptionType.String], 
        @SlashOption({ name: "canal", description: "Canal para dizer essa mensagem", required: false, type: ApplicationCommandOptionType.Channel})
        channel: SlashOptionResult[ApplicationCommandOptionType.Channel],
        interaction: CommandInteraction) {
        if (message === undefined || message === null) {
            const modal = new ModalBuilder()
            .setCustomId("sayModal")
            .setTitle("Mensagem")
            const msg = new TextInputBuilder()
            .setCustomId("message")
            .setStyle(TextInputStyle.Paragraph)
            const msgLabel = new LabelBuilder()
            .setLabel("Mensagem")
            .setTextInputComponent(msg)
            
            modal.addLabelComponents(msgLabel)
            await interaction.showModal(modal)
            return;
        }
        let sayChannel = channel || interaction.channel
        if (sayChannel === undefined || sayChannel === null || !sayChannel.isSendable()) {
            await interaction.reply("Canal inválido");
            return;
        }
        sayChannel.send(message)
        await interaction.reply({content: "Mensagem falada com sucesso.", flags: MessageFlags.Ephemeral})
    }
}