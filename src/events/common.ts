import { type ArgsOf, Discord, Guard, On } from "discordx";
import { NotBot } from "@discordx/utilities";

import { logAction } from "../utils.js";

@Discord()
export class Example {
  @On()
  @Guard(NotBot)
  async messageDelete([message]: ArgsOf<"messageDelete">) {
    if (!message.guild) return;
    logAction(message.guild, "Mensagem deletada", message.content!, message.author!, 0xff0000)
  }
  @On()
  @Guard(NotBot)
  async messageUpdate([oldMessage, newMessage]: ArgsOf<"messageUpdate">) {
    if (!newMessage.guild) return;
    logAction(newMessage.guild, "Mensagem editada", `Mensagem Antiga:\n${oldMessage.content!}\nMensagem Nova:\n${newMessage.content}`, newMessage.author!, 0x0000ff)
  }
}
