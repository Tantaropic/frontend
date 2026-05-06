const PIASTERS_PER_EGP = 100;

/**Convert a piasters-string ("12345") to an EGP dispaly number (123.45) */
export function piastersStringToEgp(value: string | number | null | undefined) : number {
    if (value === null || value === undefined) return 0;
    const piasters = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(piasters)) return 0;
    return piasters / PIASTERS_PER_EGP;
} 

/** Convert a UI EGP number to a piasters-string for outgoing payloads */
export function egpToPiastersString(egp: number) : string {
    return Math.round(egp * PIASTERS_PER_EGP).toString();
}
