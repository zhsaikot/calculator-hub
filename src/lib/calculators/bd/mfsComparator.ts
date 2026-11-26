export interface MfsTier {
  id: string;
  name: string;
  ratePct: number; // e.g. 1.49
  ratePerThousand: number; // e.g. 14.90
  note?: string;
}

export interface MfsProvider {
  id: 'bkash' | 'nagad' | 'rocket' | 'upay';
  name: string;
  color: string;
  badge: string;
  defaultChannelId: string;
  channels: MfsTier[];
}

export const MFS_PROVIDERS: MfsProvider[] = [
  {
    id: 'bkash',
    name: 'bKash (বিকাশ)',
    color: '#E2136E',
    badge: 'Popular',
    defaultChannelId: 'bkash-app',
    channels: [
      { id: 'bkash-priyo', name: 'Priyo Agent (প্রিয় এজেন্ট)', ratePct: 1.49, ratePerThousand: 14.9, note: 'Up to ৳25,000/month with 1 saved agent' },
      { id: 'bkash-app', name: 'bKash App (রেগুলার অ্যাপ)', ratePct: 1.85, ratePerThousand: 18.5, note: 'Standard app cash-out' },
      { id: 'bkash-ussd', name: 'USSD Dial (*247#)', ratePct: 1.85, ratePerThousand: 18.5, note: 'Dialing *247#' },
    ],
  },
  {
    id: 'nagad',
    name: 'Nagad (নগদ)',
    color: '#F7931E',
    badge: 'Lowest Rate',
    defaultChannelId: 'nagad-app',
    channels: [
      { id: 'nagad-app', name: 'Nagad App (নগদ অ্যাপ)', ratePct: 1.25, ratePerThousand: 12.5, note: '1.25% including VAT (৳12.50 per ৳1,000)' },
      { id: 'nagad-ussd', name: 'USSD Dial (*167#)', ratePct: 1.494, ratePerThousand: 14.94, note: '1.494% including VAT' },
    ],
  },
  {
    id: 'rocket',
    name: 'Rocket (রকেট)',
    color: '#8C3494',
    badge: 'ATM Free/Low',
    defaultChannelId: 'rocket-app',
    channels: [
      { id: 'rocket-atm', name: 'DBBL ATM (ডাচ-বাংলা এটিএম বুথ)', ratePct: 0.9, ratePerThousand: 9.0, note: 'Only ৳9 per ৳1,000 from any DBBL ATM' },
      { id: 'rocket-app', name: 'Rocket App (রকেট অ্যাপ)', ratePct: 1.67, ratePerThousand: 16.7, note: '1.67% agent cash-out' },
      { id: 'rocket-ussd', name: 'USSD Dial (*322#)', ratePct: 1.67, ratePerThousand: 16.7, note: 'Agent USSD cash-out' },
    ],
  },
  {
    id: 'upay',
    name: 'Upay (উপায়)',
    color: '#0054A6',
    badge: 'UCB',
    defaultChannelId: 'upay-app',
    channels: [
      { id: 'upay-app', name: 'Upay App (উপায় অ্যাপ)', ratePct: 1.4, ratePerThousand: 14.0, note: '৳14 per ৳1,000 from app' },
      { id: 'upay-ussd', name: 'USSD Dial (*268#)', ratePct: 1.8, ratePerThousand: 18.0, note: '৳18 per ৳1,000 via USSD' },
    ],
  },
];

export interface MfsComparisonItem {
  providerId: 'bkash' | 'nagad' | 'rocket' | 'upay';
  providerName: string;
  channelName: string;
  ratePct: number;
  ratePerThousand: number;
  inputAmount: number;
  cashOutFee: number;
  recipientGets: number; // in forward mode
  amountToSend: number; // in reverse mode
  isBestValue: boolean;
}

export interface MfsComparisonResult {
  mode: 'forward' | 'reverse';
  amount: number;
  items: MfsComparisonItem[];
  cheapestProvider: string;
  maxSavings: number;
}

/**
 * Compare all MFS Cash-out fees across bKash, Nagad, Rocket, and Upay.
 * - Mode 'forward': user enters amount to cash out -> calculates fee and net cash.
 * - Mode 'reverse': user enters desired cash in hand -> calculates exact amount needed to send.
 */
export const compareMfsCharges = (
  amount: number,
  mode: 'forward' | 'reverse' = 'forward',
  selectedChannels?: Record<string, string> // providerId -> channelId
): MfsComparisonResult => {
  const safeAmount = Math.max(0, amount);

  const items: MfsComparisonItem[] = MFS_PROVIDERS.map(provider => {
    const channelId = selectedChannels?.[provider.id] || provider.defaultChannelId;
    const channel = provider.channels.find(c => c.id === channelId) || provider.channels[0];

    let cashOutFee = 0;
    let recipientGets = 0;
    let amountToSend = safeAmount;

    if (mode === 'forward') {
      cashOutFee = Math.round((safeAmount * (channel.ratePct / 100)) * 100) / 100;
      recipientGets = Math.max(0, Math.round((safeAmount - cashOutFee) * 100) / 100);
      amountToSend = safeAmount;
    } else {
      // Reverse mode: Desired amount = in hand
      // X - (X * rate) = safeAmount => X = safeAmount / (1 - rate)
      const rawToSend = safeAmount / (1 - channel.ratePct / 100);
      amountToSend = Math.ceil(rawToSend * 100) / 100;
      cashOutFee = Math.round((amountToSend - safeAmount) * 100) / 100;
      recipientGets = safeAmount;
    }

    return {
      providerId: provider.id,
      providerName: provider.name,
      channelName: channel.name,
      ratePct: channel.ratePct,
      ratePerThousand: channel.ratePerThousand,
      inputAmount: safeAmount,
      cashOutFee,
      recipientGets,
      amountToSend,
      isBestValue: false,
    };
  });

  // Determine lowest fee
  let minFee = Infinity;
  items.forEach(it => {
    if (it.cashOutFee < minFee) {
      minFee = it.cashOutFee;
    }
  });

  let maxFee = 0;
  items.forEach(it => {
    if (it.cashOutFee > maxFee) {
      maxFee = it.cashOutFee;
    }
    if (it.cashOutFee === minFee) {
      it.isBestValue = true;
    }
  });

  const cheapest = items.find(it => it.isBestValue);

  return {
    mode,
    amount: safeAmount,
    items,
    cheapestProvider: cheapest ? cheapest.providerName : '',
    maxSavings: Math.max(0, Math.round((maxFee - minFee) * 100) / 100),
  };
};
