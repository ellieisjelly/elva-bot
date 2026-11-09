import { ApplicationCommandOptionType, ModalBuilder, LabelBuilder, TextDisplayBuilder, TextInputBuilder
  , TextInputStyle, type CommandInteraction, 
  FileUploadBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  ButtonInteraction
} from "discord.js";
import { ButtonComponent, Discord, Slash, SlashOption, type SlashOptionResult} from "discordx";
import { createServer, getServerData } from "../db.js";

@Discord()
export class Example {
  @ButtonComponent({id:"form-register"})
  async buttonHandler(interaction: ButtonInteraction) {
    await showModal(interaction)
  }

  @Slash({ description: "pong" })
  async pong(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("meu pau que faz boing");
  }

  @Slash({description: "Configuração do bot"})
  async config(
    @SlashOption({name: "cargo_admin", description: "Cargo de Admin", required: true, type: ApplicationCommandOptionType.Role})
    adminRole: SlashOptionResult[ApplicationCommandOptionType.Role],
    @SlashOption({name: "cargo_reviewer", description: "Cargo para avaliador de formulario", required: true, type: ApplicationCommandOptionType.Role})
    reviewerRole: SlashOptionResult[ApplicationCommandOptionType.Role],
    @SlashOption({name: "canal_admin", description: "Canal para log de ações admin", required: true, type: ApplicationCommandOptionType.Channel})
    adminChannel: SlashOptionResult[ApplicationCommandOptionType.Channel],
    @SlashOption({name: "canal_review_formulario", description: "Canal para review de formularios", required: true, type: ApplicationCommandOptionType.Channel})
    reviewChannel: SlashOptionResult[ApplicationCommandOptionType.Channel],
    interaction: CommandInteraction
  ) {
    if (interaction.guildId === null) {
      await interaction.reply("Esse comando só pode ser executado em um servidor.")
      return;
    }
    createServer({serverId: interaction.guildId, adminRole: adminRole.id, reviewerRole: reviewerRole.id, logChannel: adminChannel.id, formEvalChannel: reviewChannel.id})
  }

  @Slash({description:"ai caraio"})
  async get(interaction: CommandInteraction) {
    console.log(await getServerData(interaction.guildId!))
    interaction.reply("coco")
  }

  @Slash({ description: "Criar formulario de personagem" })
  async criar_formulario(
    @SlashOption({
      description: "Canal para mandar o formulario",
      name: "canal",
      required: false,
      type: ApplicationCommandOptionType.Channel
    })
    channel: SlashOptionResult[ApplicationCommandOptionType.Channel],
    interaction: CommandInteraction
  ): Promise<void> {
    let formChannel = channel || interaction.channel
    if (formChannel === undefined || formChannel === null || !channel.isSendable()) {
      await interaction.reply("Canal inválido");
      return;
    }
    if (interaction.guildId === null) {
      await interaction.reply("Esse comando só pode ser executado em um servidor.")
      return;
    }
    const button = new ButtonBuilder()
      .setLabel("Cadastrar Personagem")
      .setStyle(ButtonStyle.Primary)
      .setCustomId("form-register")
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(button)
    await channel.send({
      components: [row]
    })
    await interaction.reply("Formulario de personagem criado!");
  }
}

async function showModal(interaction: ButtonInteraction) {
    const modal = new ModalBuilder()
      .setCustomId("formulario_personagem")
      .setTitle("Formulario de personagem");
    
    const modalDesc = new TextDisplayBuilder().setContent("## Conte-nos um pouco sobre o seu personagem!\nNosso servidor não compromete na história que queremos contar, por isso, garanta que seu personagem *realmente* se encaixe no mundo em que criamos.\n*Sua ficha será avaliada pela nossa equipe em um prazo de 48 horas, caso seja aprovada, você receberá acesso ao servidor.*")
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
        new StringSelectMenuOptionBuilder().setLabel("Orcs").setValue("orcs"),
        new StringSelectMenuOptionBuilder().setLabel("Mago").setValue("mage"),
        new StringSelectMenuOptionBuilder().setLabel("Necromante").setValue("necromant")
      ])
    const roleLabel = new LabelBuilder()
      .setLabel("Classe do Personagem")
      .setStringSelectMenuComponent(role)
    const imgLabel = new LabelBuilder()
      .setLabel("Imagem do Personagem (Opcional)")
      .setFileUploadComponent(img);
    
    modal.addTextDisplayComponents(modalDesc);
    modal.addLabelComponents([nameLabel, descLabel, roleLabel, imgLabel]);
    await interaction.showModal(modal)
}