export const sources = {
  ftc: { title: 'FTC: Bringing Dark Patterns to Light (2022)', url: 'https://www.ftc.gov/reports/bringing-dark-patterns-light' },
  consent: { title: 'EDPB: consent and lawful processing', url: 'https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en' },
  dsa: { title: 'EU Digital Services Act, Article 25', url: 'https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng' },
};

export const entries = [
  { id: 'cookies', name: 'Obstruction', description: 'Making a protective choice take more effort than the choice a site wants you to make. The exit exists; they just put furniture in front of it.', example: 'Accept tracking in one tap, but hunt through three menus to refuse.', law: 'GDPR consent must be freely given; withdrawing it must be as easy as giving it.', source: 'consent' },
  { id: 'untick', name: 'Preselection', description: 'Choosing for you before you have chosen anything. A checked box quietly turns doing nothing into saying yes.', example: 'A newsletter and partner-sharing box arrive already ticked.', law: 'Pre-ticked boxes do not constitute valid GDPR consent.', source: 'consent' },
  { id: 'decline', name: 'Confirmshaming', description: 'Writing the refusal as an insult to make you feel bad about choosing it. Your button is not a personality test.', example: 'The discount pop-up offers “No, I prefer wasting money.”', law: 'Manipulative interfaces may raise issues under the FTC Act’s unfairness or deception ban.', source: 'ftc' },
  { id: 'remove', name: 'Sneak into basket', description: 'Adding an extra purchase without a clear request from you. The cart has developed expensive opinions.', example: 'A protection plan appears beside the item you actually selected.', law: 'Adding unwanted charges deceptively can violate the FTC Act.', source: 'ftc' },
  { id: 'cheaper', name: 'Drip pricing', description: 'Showing a tempting starting price, then revealing unavoidable charges later. The headline price is only the opening act.', example: 'A $12 booking acquires an $8 service fee at checkout.', law: 'Deceptive fee disclosures can violate the FTC Act; some sectors have additional rules.', source: 'ftc' },
  { id: 'wait', name: 'Fake urgency', description: 'Inventing scarcity or a deadline to rush your decision. Sometimes the best click is no click.', example: 'A “last chance” countdown restarts whenever the page reloads.', law: 'False scarcity claims can be deceptive under the FTC Act.', source: 'ftc' },
  { id: 'download', name: 'Disguised ads', description: 'Making advertising look like the content or control you came for. The loudest download button might download regret.', example: 'An ad resembles a file button while the real file sits below it.', law: 'Misleading people about what is advertising can violate the FTC Act.', source: 'ftc' },
  { id: 'trick', name: 'Trick question', description: 'Using tangled wording to make your answer mean the opposite of what you intended. Three negatives do not make a good interface.', example: '“Do not disable offers” sits beside a mysterious switch.', law: 'GDPR consent must be informed and unambiguous.', source: 'consent' },
  { id: 'close', name: 'Nagging', description: 'Asking again and again after you have refused, hoping annoyance will do the selling. No remains a complete answer.', example: 'A notification request reappears every time you dismiss it.', law: 'The DSA restricts deceptive or manipulative interface design on covered online platforms, with scope exceptions.', source: 'dsa' },
  { id: 'private', name: 'Privacy zuckering / default settings', description: 'Steering you into sharing more than you meant to through defaults and confusing controls. Privacy should not be a scavenger hunt.', example: 'Public profile is on; “hide my activity” is off.', law: 'When processing relies on GDPR consent, it must be freely given, informed and unambiguous.', source: 'consent' },
  { id: 'gym', name: 'Roach motel', description: 'Making entry effortless and leaving exhausting. You signed up for exercise, but the cancellation is the obstacle course.', example: 'Cancellation hides behind pause offers and repeated confirmation screens.', law: 'Deceptive cancellation obstacles can violate the FTC Act.', source: 'ftc' },
];

const KEY = 'reject-all-v1';
export function createProgress(getStorage = () => globalThis.localStorage) {
  let data = { unlocked: [], best: 0, settings: {} };
  try {
    const saved = JSON.parse(getStorage().getItem(KEY));
    if (saved && typeof saved === 'object') {
      data.unlocked = Array.isArray(saved.unlocked) ? [...new Set(saved.unlocked.filter(id => entries.some(entry => entry.id === id)))] : [];
      data.best = Number.isFinite(saved.best) && saved.best >= 0 ? Math.floor(saved.best) : 0;
      for (const name of ['mute', 'relaxed', 'reduced']) if (typeof saved.settings?.[name] === 'boolean') data.settings[name] = saved.settings[name];
    }
  } catch { /* Memory-only progress remains usable when storage is denied. */ }
  const save = () => { try { getStorage().setItem(KEY, JSON.stringify(data)); } catch { /* Memory-only fallback. */ } };
  return {
    get unlocked() { return [...data.unlocked]; },
    get best() { return data.best; },
    get settings() { return { ...data.settings }; },
    unlock(id) {
      if (!entries.some(entry => entry.id === id) || data.unlocked.includes(id)) return false;
      data.unlocked.push(id); save(); return true;
    },
    record(score) { data.best = Math.max(data.best, score); save(); },
    configure(settings) { data.settings = { ...data.settings, ...settings }; save(); },
    reset() { data = { unlocked: [], best: 0, settings: {} }; save(); },
  };
}
