import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export default publicProcedure
  .input(z.object({ name: z.string() }))
  .mutation(({ input }) => {
    console.log('Hi route called with input:', input);
    const result = {
      hello: input.name,
      timestamp: Date.now(),
    };
    console.log('Hi route returning:', result);
    return result;
  });