import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Domain } from "./model";
import { decodeHex } from "@subsquid/evm-processor";
import { events } from "./abi/Registry";
import { processor, GRAVATAR_CONTRACT } from "./processor";

// Define a function to extract data from logs
function extractData(log: any) {
  // Replace this with your actual logic to extract data from the log
  // Example:
  const id = log.data.id;
  const owner = log.data.owner;
  const displayName = log.data.displayName;
  const imageUrl = log.data.imageUrl;
  return { id, owner, displayName, imageUrl };
}

// Define a function to handle processing for Gravatar events
async function processGravatarEvents(ctx: any) {
  const gravatars = new Map<string, Domain>();

  for (const block of ctx.blocks) {
    for (const event of block.logs) {
      if (
        event.address === GRAVATAR_CONTRACT &&
        (event.topics[0] === events.NewGravatar.topic ||
          event.topics[0] === events.UpdatedGravatar.topic)
      ) {
        const { id, owner, displayName, imageUrl } = extractData(event);
        const idString = "0x" + id.toString(16);

        gravatars.set(
          idString,
          new Domain({
            id: idString,
            owner: decodeHex(owner),
            displayName,
            imageUrl,
          })
        );
      }
    }
  }

  await ctx.store.upsert([...gravatars.values()]);
}

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  await processGravatarEvents(ctx);
}).catch((error) => {
  console.error("Error processing data:", error);
});
