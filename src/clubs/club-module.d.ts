/** `@club` is aliased at build time to src/clubs/<NEXT_PUBLIC_CLUB>/index.ts. */
declare module "@club" {
  import type { ClubDefinition } from "@/clubs/types";
  const club: ClubDefinition;
  export default club;
}
