export const sources = {
  phishing: { title: 'FTC: Recognize and avoid phishing scams', url: 'https://consumer.ftc.gov/articles/how-recognize-avoid-phishing-scams' },
  nativeads: { title: 'FTC: Native advertising guidance', url: 'https://www.ftc.gov/business-guidance/resources/native-advertising-guide-businesses' },
  deceptive: { title: 'Deceptive Patterns: types (Harry Brignull et al.)', url: 'https://deceptive.design/types/' },
  ftc: { title: 'FTC: Bringing Dark Patterns to Light (2022)', url: 'https://www.ftc.gov/reports/bringing-dark-patterns-light' },
  consent: { title: 'EDPB: consent and lawful processing', url: 'https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en' },
  dsa: { title: 'EU Digital Services Act, Article 25', url: 'https://eur-lex.europa.eu/eli/reg/2022/2065/oj/eng' },
  planet49: { title: 'EU Court of Justice: Planet49 (2019)', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62017CJ0673' },
  gdpr: { title: 'GDPR, Articles 7 and 25', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng' },
  apple: { title: 'Apple App Review Guidelines, 3.1.1', url: 'https://developer.apple.com/app-store/review/guidelines/#in-app-purchase' },
};

export const entries = [
  { id: 'cookies', name: 'Obstruction', description: 'Making a protective choice take more effort than the choice a site wants you to make. The exit exists; they just put furniture in front of it.', example: 'Accept tracking in one tap, but hunt through three menus to refuse.', law: 'GDPR consent must be freely given; withdrawing it must be as easy as giving it.', source: 'consent' },
  { id: 'untick', name: 'Preselection', description: 'Choosing for you before you have chosen anything. A checked box quietly turns doing nothing into saying yes.', example: 'A newsletter and partner-sharing box arrive already ticked.', law: 'Pre-ticked boxes do not constitute valid GDPR consent.', source: 'consent' },
  { id: 'decline', name: 'Confirmshaming', description: 'Writing the refusal as an insult to make you feel bad about choosing it. Your button is not a personality test.', example: 'The discount pop-up offers “No, I prefer wasting money.”', law: 'Manipulative interfaces may raise issues under the FTC Act’s unfairness or deception ban.', source: 'ftc' },
  { id: 'remove', name: 'Sneak into basket', description: 'Adding an extra purchase without a clear request from you. The cart has developed expensive opinions.', example: 'A protection plan appears beside the item you actually selected.', law: 'Adding unwanted charges deceptively can violate the FTC Act.', source: 'ftc' },
  { id: 'wait', name: 'Fake urgency', description: 'Inventing scarcity or a deadline to rush your decision. Sometimes the best click is no click.', example: 'A “last chance” countdown restarts whenever the page reloads.', law: 'False scarcity claims can be deceptive under the FTC Act.', source: 'ftc' },
  { id: 'download', name: 'Disguised ads', description: 'Making advertising look like the content or control you came for. The loudest download button might download regret.', example: 'An ad resembles a file button while the real file sits below it.', law: 'Misleading people about what is advertising can violate the FTC Act.', source: 'ftc' },
  { id: 'trick', name: 'Trick question', description: 'Using tangled wording to make your answer mean the opposite of what you intended. Three negatives do not make a good interface.', example: '“Do not disable offers” sits beside a mysterious switch.', law: 'GDPR consent must be informed and unambiguous.', source: 'consent' },
  { id: 'close', name: 'Nagging', description: 'Asking again and again after you have refused, hoping annoyance will do the selling. No remains a complete answer.', example: 'A notification request reappears every time you dismiss it.', law: 'The DSA restricts deceptive or manipulative interface design on covered online platforms, with scope exceptions.', source: 'dsa' },
  { id: 'private', name: 'Privacy zuckering / default settings', description: 'Steering you into sharing more than you meant to through defaults and confusing controls. Privacy should not be a scavenger hunt.', example: 'Public profile is on; “hide my activity” is off.', law: 'When processing relies on GDPR consent, it must be freely given, informed and unambiguous.', source: 'consent' },
  { id: 'gym', name: 'Roach motel', description: 'Making entry effortless and leaving exhausting. You signed up for exercise, but the cancellation is the obstacle course.', example: 'Cancellation hides behind pause offers and repeated confirmation screens.', law: 'Deceptive cancellation obstacles can violate the FTC Act.', source: 'ftc' },
];

entries.push(
  { id: 'scroll', name: 'Buried information', description: 'Placing an important choice beneath a wall of text makes it easy to miss.', example: 'An opt-out sits near the end of a long agreement while acceptance stays prominent.', law: 'FTC guidance calls for clear and conspicuous disclosures; burying important terms can be deceptive.', source: 'ftc' },
  { id: 'slide', name: 'Preset consent', description: 'A control starts at the setting the business wants, making inaction look like agreement.', example: 'Partner consent sliders arrive set to maximum sharing, with some made to look unavailable.', law: 'The EU Court of Justice rejected pre-ticked cookie consent in Planet49 (2019). GDPR consent requires an affirmative act.', source: 'planet49' },
  { id: 'hold', name: 'Cancellation friction', description: 'Adding unnecessary effort to leaving can pressure people into keeping an unwanted subscription.', example: 'A cancellation button requires a long hold while retention offers interrupt the flow.', law: 'Deceptive cancellation obstacles draw FTC scrutiny and can violate the FTC Act.', source: 'ftc' },
  { id: 'whack', name: 'Resetting privacy choices', description: 'An update restores sharing defaults after you deliberately turned them off.', example: 'Tracking switches turn back on after a service update.', law: 'GDPR Article 25 requires data protection by default. Where consent is the basis, Article 7 requires withdrawal to be as easy as giving consent.', source: 'gdpr' },
  { id: 'odds', name: 'Hidden loot box odds', description: 'Selling a random reward while making its probabilities hard to find prevents an informed choice.', example: 'Drop rates hide several cards into a shop carousel, away from the buy button.', law: 'Apple App Store rules require paid random-item mechanisms such as loot boxes to disclose odds before purchase.', source: 'apple' },
);

entries.push(
  { id: 'trial', name: 'Hidden subscription terms', description: 'Emphasising a free trial while obscuring when full-price billing begins.', example: 'A renewal date sits in small print beside more prominent reminder dates.', law: 'Buried material subscription terms can be deceptive. The FTC identifies hidden subscriptions as a dark-pattern concern.', source: 'ftc' },
  { id: 'unsubscribe', name: 'Unsubscribe obstruction', description: 'Adding detours between a request to stop messages and the option that actually stops them.', example: 'An email preferences page promotes a temporary pause while hiding the permanent opt-out.', law: 'The FTC identifies obstructive cancellation flows as a dark-pattern concern. Applicable requirements depend on context.', source: 'ftc' },
  { id: 'contacts', name: 'Forced sharing', description: 'Pressuring people to upload an address book using prominent acceptance and confusing refusal choices.', example: 'Find-friends onboarding offers a one-time upload after you deny contact access.', law: 'Where GDPR consent is the basis, it must be freely given, specific, informed and unambiguous.', source: 'consent' },
  { id: 'delete', name: 'Account roach motel', description: 'Making account creation easy while burying the permanent exit behind settings and retention offers.', example: 'Deactivate and Take a break appear before a hidden Delete account option.', law: 'Deceptive exit obstacles can raise consumer-protection concerns; account deletion rights depend on the context.', source: 'ftc' },
  { id: 'price', name: 'Price framing and drip pricing', description: 'Using different billing periods and added fees to make an expensive plan look cheaper.', example: '$1.99 per week costs $103.48 over 52 weeks, more than $6 per month over 12 months.', law: 'Comparing billing periods is not inherently unlawful. Deceptive pricing or hidden fees can raise FTC Act concerns.', source: 'ftc' },
);

entries.push(
  { id: 'phish', name: 'Impersonation', description: 'A familiar sender name can hide an unrelated address. Compare the actual domain with the one the game supplies.', example: 'A message from luma.example.mail.example is outside the stated luma.example domain.', law: 'FTC guidance describes how impersonation messages seek passwords and other personal information. Domain matching here is a simplified puzzle, not proof that a real email is safe.', source: 'phishing' },
  { id: 'adspot', name: 'Paid posts', description: 'Advertising can look like the ordinary posts around it. Sponsorship disclosures identify the paid placement.', example: 'A recommendation is labelled Sponsored or Paid partnership rather than Following.', law: 'FTC guidance explains that advertising should be recognizable and that necessary disclosures must be clear and prominent. The game tests recognition rather than declaring every sponsored post unlawful.', source: 'nativeads' },
  { id: 'disconnect', name: 'Bundled tracking', description: 'Advertising connections are mixed with essential functions.', example: 'Checkout needs its basket, but not an ad auction profile.', law: 'The FTC discusses interfaces that steer data choices. Requirements depend on context.', source: 'ftc' },
  { id: 'mask', name: 'Excessive data exposure', description: 'A report includes identifiers it does not need.', example: 'Publish survey totals while redacting names and contact details.', law: 'The game illustrates selective disclosure; real privacy obligations depend on the data and purpose.', source: 'ftc' },
  { id: 'shred', name: 'Unnecessary retention', description: 'Keeping identifying records when anonymous reports would serve the task.', example: 'An aggregate report needs no individual contact sheet.', law: 'This is a data-minimisation exercise, not a universal instruction to destroy records.', source: 'ftc' },
  { id: 'sort', name: 'Permission bundling', description: 'Unrelated permissions are presented alongside those needed for a task.', example: 'A voice recorder asks for an address book as well as microphone access.', law: 'Permission needs depend on the stated task; the game supplies an explicit requirements list.', source: 'ftc' },
  { id: 'prove', name: 'Misleading claims', description: 'A sales claim conflicts with its own records or terms.', example: 'A claimed discount leaves the price unchanged from yesterday.', law: 'Evidence and context matter when assessing whether a claim misleads.', source: 'ftc' },
  { id: 'authentic', name: 'Fake social proof', description: 'A review feed inflates apparent independent support.', example: 'The same account and review are counted again as a different buyer.', law: 'An incentive alone does not establish illegality. This puzzle distinguishes disclosed samples from duplicate copies and false independence claims.', source: 'deceptive' },
  { id: 'stock', name: 'Fake scarcity', description: 'A low-stock claim conflicts with visible inventory records.', example: 'Only one left is displayed while the same-time ledger shows twelve available.', law: 'Low stock can be real; this puzzle flags only a contradiction supported by records.', source: 'deceptive' },
  { id: 'basket', name: 'Substitution at checkout', description: 'A selected product or quantity changes during checkout.', example: 'One standard mug becomes two mugs or a premium model.', law: 'The selection receipt supplies the comparison; a changed line differs from an added extra.', source: 'deceptive' },
  { id: 'label', name: 'Native advertising', description: 'Paid cards resemble independently chosen editorial content.', example: 'A lifestyle recommendation reveals sponsor approval in its disclosure.', law: 'A headline alone cannot establish sponsorship. Read the disclosure before classifying.', source: 'deceptive' },
  { id: 'guest', name: 'Forced enrolment', description: 'Checkout steers a purchaser toward an unnecessary account.', example: 'Guest checkout sits beneath account creation and rewards offers.', law: 'Account requirements are context-dependent. The fictional shop explicitly offers guest checkout.', source: 'deceptive' },
);

const canonicalId = id => id === 'cheaper' ? 'price' : id;
const KEY = 'reject-all-v1';
export function createProgress(getStorage = () => globalThis.localStorage) {
  let data = { unlocked: [], seen: [], best: 0, settings: {} };
  try {
    const saved = JSON.parse(getStorage().getItem(KEY));
    if (saved && typeof saved === 'object') {
      data.unlocked = Array.isArray(saved.unlocked) ? [...new Set(saved.unlocked.map(canonicalId).filter(id => entries.some(entry => entry.id === id)))] : [];
      // A v1 unlock proves an encounter; losses were not recorded in v1.
      data.seen = [...new Set([...data.unlocked, ...(Array.isArray(saved.seen) ? saved.seen.map(canonicalId) : [])])].filter(id => entries.some(entry => entry.id === id));
      data.best = Number.isFinite(saved.best) && saved.best >= 0 ? Math.floor(saved.best) : 0;
      for (const name of ['mute', 'relaxed', 'reduced']) if (typeof saved.settings?.[name] === 'boolean') data.settings[name] = saved.settings[name];
      for (const name of ['musicVolume', 'effectsVolume']) if (Number.isFinite(saved.settings?.[name])) data.settings[name] = Math.max(0, Math.min(1, saved.settings[name]));
    }
  } catch { /* Memory-only progress remains usable when storage is denied. */ }
  const save = () => { try { getStorage().setItem(KEY, JSON.stringify(data)); } catch { /* Memory-only fallback. */ } };
  return {
    get unlocked() { return [...data.unlocked]; },
    get seen() { return [...data.seen]; },
    get best() { return data.best; },
    get settings() { return { ...data.settings }; },
    encounter(id) {
      id = canonicalId(id);
      if (!entries.some(entry => entry.id === id) || data.seen.includes(id)) return false;
      data.seen.push(id); save(); return true;
    },
    unlock(id) {
      id = canonicalId(id);
      if (!entries.some(entry => entry.id === id) || data.unlocked.includes(id)) return false;
      data.unlocked.push(id); save(); return true;
    },
    record(score) { data.best = Math.max(data.best, score); save(); },
    configure(settings) { data.settings = { ...data.settings, ...settings }; save(); },
    reset() { data = { unlocked: [], seen: [], best: 0, settings: {} }; save(); },
  };
}
