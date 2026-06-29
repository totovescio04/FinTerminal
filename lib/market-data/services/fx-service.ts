import type { Currency } from "@/lib/market-data/types";
import { marketDataRepository } from "./core";

/** FX rates and conversion (routed through the repository/cache). */
export const fxService = {
  getRate: (base: Currency, quote: Currency) => marketDataRepository.getFXRate(base, quote),
  async convert(amount: number, from: Currency, to: Currency): Promise<number> {
    if (from === to) return amount;
    const { data } = await marketDataRepository.getFXRate(from, to);
    return amount * data.rate;
  },
};
