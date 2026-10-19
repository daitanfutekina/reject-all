// Shared product identities. Real game controls live in site-content;
// the surrounding catalogue/navigation is scenery, not a second interaction layer.
export const BASES = Object.freeze({
  market: { name: 'parcel', domain: 'parcel.example', accent: '#ffd814', label: 'Marketplace', caption: 'Everyday finds. Extraordinary little extras.' },
  studio: { name: 'Forma', domain: 'account.forma.example', accent: '#1473e6', label: 'Creative software', caption: 'Your next great idea starts here.' },
  harvest: { name: 'FreshBox', domain: 'freshbox.example', accent: '#234f27', label: 'Meal delivery', caption: 'A little less planning. A lot more delicious.' },
  social: { name: 'loop', domain: 'loop.example', accent: '#6754cb', label: 'Social app', caption: 'A little closer to your world.' },
  astral: { name: 'Astral Tide', domain: 'astraltide.example', accent: '#d9ba77', label: 'Gacha game', caption: 'A wish written in the stars.' },
  software: { name: 'FileNest', domain: 'filenest.example', accent: '#147db2', label: 'Software downloads', caption: 'The right file. Somewhere between the buttons.' },
  stream: { name: 'AFTERHOURS', domain: 'afterhours.example', accent: '#e8333c', label: 'Film & streaming', caption: 'One more episode. One more little condition.' },
  fitness: { name: 'PULSE', domain: 'members.pulse.example', accent: '#f36d38', label: 'Fitness membership', caption: 'Build a habit. Try to cancel it.' },
  travel: { name: 'wayfare', domain: 'wayfare.example', accent: '#006ce4', label: 'Travel booking', caption: 'A room with a view. A price with a footnote.' },
  arcade: { name: 'Capsule Club', domain: 'capsuleclub.example', accent: '#3466df', label: 'Game shop & capsules', caption: 'Small surprises. Exceptionally small print.' },
  filehost: { name: 'MediaDrop', domain: 'mediadrop.example', accent: '#1686d9', label: 'File hosting', caption: 'Your file is ready. So are the distractions.' },
  freevideo: { name: 'Showroom', domain: 'showroom.example', accent: '#19c8bb', label: 'Free video player', caption: 'The show starts after the interruptions.' },
  tickets: { name: 'Seatline', domain: 'seatline.example', accent: '#026cdf', label: 'Live event tickets', caption: 'One unforgettable night. A few very forgettable extras.' },
  recipes: { name: 'RecipeTable', domain: 'recipetable.example', accent: '#d6521d', label: 'Recipe community', caption: 'Come for dinner. Stay for the newsletter prompts.' },
  qa: { name: 'Query', domain: 'query.example', accent: '#b92b23', label: 'Questions & answers', caption: 'A perfectly good question. An account-shaped interruption.' },
  mail: { name: 'Postbox', domain: 'mail.postbox.example', accent: '#c63832', label: 'Mail & inbox', caption: 'Your inbox. Everybody else’s agenda.' },
});

export const SITE_CONTEXTS = Object.freeze({
  cookies: ['market', 'recipes', 'travel'], untick: ['market', 'harvest', 'tickets'],
  decline: ['harvest', 'recipes', 'qa'], remove: ['market', 'harvest', 'tickets'], wait: ['market', 'travel', 'tickets'],
  download: ['software', 'filehost', 'arcade'], trick: ['social', 'studio', 'qa'], close: ['social', 'freevideo', 'qa'],
  private: ['social', 'studio', 'stream'], scroll: ['studio', 'fitness', 'recipes'], slide: ['social', 'studio', 'software'],
  hold: ['studio', 'fitness', 'stream'], whack: ['social', 'software'], odds: ['astral', 'arcade'], trial: ['studio', 'fitness', 'stream'],
  unsubscribe: ['market', 'harvest', 'recipes'], contacts: ['social', 'arcade', 'fitness'], delete: ['social', 'fitness', 'stream'],
  price: ['studio', 'travel', 'stream'], gym: ['fitness', 'studio', 'stream'],
  phish: ['mail', 'social', 'studio'], adspot: ['social', 'market', 'qa'],
});
const titles = {
  'Trestle Parcel': 'remove', 'Ribbon Quarry': 'decline', 'Folio Crate': 'download', 'Rep Quarry Club': 'gym',
  'Prism Crate': 'odds', 'Quiet Trellis': 'private', 'Partner Pantry': 'slide', 'Reset Orchard': 'whack',
  'Hurry Thimble': 'wait', 'Post Pebble': 'untick', 'Syntax Attic': 'trick', 'Sample Harbor': 'trial',
  'Budget Birch': 'price', 'Nudge Cabinet': 'close',
};
const products = [
  ['Studio wireless headphones', '$29.99'], ['Steel travel tumbler', '$18.49'], ['Adjustable desk lamp', '$24.99'],
  ['Canvas everyday tote', '$14.99'], ['Blue hardback notebook', '$12.99'], ['Glass tea jar', '$16.99'],
  ['Everyday running shoes', '$42.99'], ['Portable mini speaker', '$23.99'], ['Desk succulent', '$9.99'],
  ['Wireless game controller', '$34.99'], ['Cotton throw blanket', '$21.49'], ['USB-C charger & cable', '$15.99'],
];
const meals = [
  { image: 'meal', name: 'Lemon & herb salmon', detail: 'with pearl couscous and crisp green beans', alt: 'Herb-roasted salmon with couscous, green beans and lemon', minutes: 30, tag: 'High protein', category: 'Seafood / Salmon', headline: 'The lemon salmon\nyou’ll make again', copy: 'Golden edges, fresh herbs and a dinner worth gathering for.' },
  { image: 'meal-tomato', name: 'Tomato & basil rigatoni', detail: 'with roasted tomatoes and Parmesan', alt: 'Rigatoni with roasted tomatoes, fresh basil and Parmesan in an ivory bowl', minutes: 25, tag: 'Comfort food', category: 'Pasta / Tomato', headline: 'A little basil.\nA bowl of comfort.', copy: 'Roasted tomatoes, a little Parmesan and a reason to stay for dinner.' },
  { image: 'meal-chickpea', name: 'Golden chickpea bowl', detail: 'with sweet potato and lemon tahini', alt: 'Golden chickpeas, sweet potato, couscous and spinach with lemon tahini', minutes: 35, tag: 'Plant based', category: 'Vegetarian / Grain bowls', headline: 'Good things\nin one bowl.', copy: 'Golden chickpeas, bright lemon and a very satisfying crunch.' },
];
const posts = [
  { user: 'freshbox.kitchen', initial: 'F', image: 'meal', location: 'A little inspiration for your evening', caption: 'A slower evening. A better dinner. 🌿', alt: 'A plated salmon dinner with couscous and vegetables', likes: '1,204' },
  { user: 'mae.makes', initial: 'M', image: 'post-desk', location: 'Somewhere between ideas', caption: 'A clean page and a very full coffee cup. Back to making things.', alt: 'A sunlit creative desk with a sketchbook, coffee and plants', likes: '864' },
  { user: 'the.long.way', initial: 'L', image: 'post-coast', location: 'The coast, eventually', caption: 'Took the long way home. Would recommend.', alt: 'A boardwalk leading through sea grass toward the ocean at sunset', likes: '2,318' },
  { user: 'little.weekends', initial: 'W', image: 'post-coffee', location: 'Our usual corner', caption: 'No plans until the coffee is finished. Maybe not even then.', alt: 'A latte, almond croissant and book on a warm wooden cafe table', likes: '672' },
];
export function selectBase(title, sample, gameId = '') {
  const id = gameId || titles[title] || (/Circle|Friend|Social|Profile|Account|Archive/.test(title) ? 'contacts' : /Latch|Velvet Subscription|Monthly/.test(title) ? 'hold' : 'cookies');
  const options = SITE_CONTEXTS[id] || ['market', 'studio', 'harvest'];
  return options[Math.min(options.length - 1, Math.floor(sample * options.length))];
}

function el(tag, text = '', cls = '') {
  const node = document.createElement(tag); node.className = cls; node.textContent = text; return node;
}
function image(src, alt, cls) {
  const node = el('img', '', cls); node.src = new URL('../' + src, import.meta.url).href; node.alt = alt; node.decoding = 'async'; return node;
}
function icon(name) {
  const node = image('assets/icons/' + name + '.svg', '', 'site-icon');
  node.setAttribute('aria-hidden', 'true'); return node;
}
function group(cls, ...children) { const node = el('div', '', cls); node.append(...children); return node; }
function textPair(top, bottom, cls = '') { return group('site-text-pair ' + cls, el('small', top), el('strong', bottom)); }
function mark(base) {
  const node = el('span', BASES[base].name, 'site-wordmark');
  if (base === 'studio') node.append(el('i', 'F', 'forma-mark'));
  if (base === 'harvest') node.append(el('i', '❧', 'harvest-mark'));
  if (base === 'social') node.append(el('i', '', 'loop-mark'));
  return node;
}
function nav(items, cls = '') { return group('site-nav ' + cls, ...items.map(item => el('span', item))); }

function browser(base, appMode, title) {
  const bar = el('div', '', appMode ? 'device-status' : 'browser-bar faithful-browser');
  if (appMode) {
    bar.append(el('strong', '9:41'), el('span', '', 'dynamic-island'), group('device-signals', icon('signal'), icon('wifi'), icon('battery')));
  } else {
    const route = title ? '/' + title.toLowerCase().replaceAll(' ', '-') : '';
    bar.append(group('browser-controls', icon('back'), icon('forward')), group('browser-address', icon('lock'), el('span', BASES[base].domain + route), icon('refresh')), group('browser-controls', icon('share'), icon('tabs')));
  }
  return bar;
}
function marketHeader() {
  const top = group('market-top', mark('market'), textPair('Deliver to', 'Starkville 39759', 'delivery'), group('market-search', el('span', 'All', 'search-category'), el('span', 'Search parcel', 'search-placeholder'), group('search-submit', icon('search'))), textPair('Hello, Alex', 'Account & Lists', 'account'), group('market-cart', icon('cart'), el('b', '2'), el('span', 'Cart')));
  return group('site-header', top, nav(['☰ All', 'Today’s deals', 'Customer service', 'Buy again', 'Gift cards'], 'market-nav'), group('market-delivery', icon('pin'), el('span', 'Delivering to Starkville 39759 — Update location')));
}
function studioHeader() {
  return group('site-header', group('studio-top', mark('studio'), nav(['Creativity & Design', 'Plans', 'Learn', 'Support']), group('studio-account', icon('grid'), el('span', 'AL', 'profile-avatar'))), group('studio-subnav', el('strong', 'Your account'), nav(['Overview', 'Plans and payment', 'Security', 'Privacy'])));
}
function harvestHeader() {
  return group('site-header', group('harvest-top', mark('harvest'), nav(['Our plans', 'On the menu', 'How it works']), group('harvest-account', icon('user'), el('span', 'My account'))), group('harvest-ribbon', el('span', 'Fresh ingredients. Flexible plans. Delivered to your door.'), el('span', '★ 4.7 / 5')));
}
function socialHeader() {
  return group('site-header', group('social-top', mark('social'), group('social-search', icon('search'), el('span', 'Search')), group('social-actions', icon('heart'), icon('message'), el('span', 'AL', 'profile-avatar'))));
}
function astralHeader() {
  return group('site-header', group('astral-top', group('astral-location', icon('back'), el('span', 'Stellar Exchange')), group('astral-wallet', el('span', '✦ 1,600'), el('span', '◇ 12'), icon('plus'))));
}
function softwareHeader() {
  return group('site-header', group('software-top', mark('software'), group('software-search', icon('search'), el('span', 'Find software, apps and games')), el('span', 'Windows', 'software-os')), nav(['Windows', 'Mac', 'Android', 'Security', 'Utilities', 'Games', 'Latest updates'], 'software-nav'));
}
function streamHeader() {
  return group('site-header', group('stream-top', mark('stream'), nav(['Home', 'Series', 'Films', 'My list']), group('stream-account', icon('search'), el('span', 'A', 'stream-avatar'))), group('stream-strip', el('span', 'Your membership'), el('span', 'Standard plan · Manage account')));
}
function fitnessHeader() {
  return group('site-header', group('fitness-top', mark('fitness'), nav(['Find a club', 'Memberships', 'Classes', 'Training']), el('span', 'Member portal', 'fitness-login')), group('fitness-strip', el('span', 'Your club: Starkville'), el('span', 'Open today 5 am – 11 pm')));
}
function travelHeader() {
  return group('site-header', group('travel-top', mark('travel'), group('travel-account', el('span', 'USD'), el('span', 'List your property'), el('span', 'AL', 'travel-avatar'))), nav(['◉ Stays', '✈ Flights', 'Car rentals', 'Attractions', 'Airport taxis'], 'travel-nav'));
}
function arcadeHeader() {
  return group('site-header', group('arcade-top', mark('arcade'), group('arcade-coins', el('span', '✦ 2,400'), el('span', '＋', 'coin-add'))), nav(['Discover', 'My collection', 'The capsule shop', 'Friends'], 'arcade-nav'));
}
function filehostHeader() {
  return group('site-header', group('filehost-top', mark('filehost'), nav(['Upload', 'My files', 'Upgrade']), group('filehost-account', el('span', 'Sign up'), el('span', 'Log in'))));
}
function freevideoHeader() {
  return group('site-header', group('freevideo-top', mark('freevideo'), nav(['Home', 'Movies', 'TV shows', 'Top rated']), group('freevideo-search', icon('search'), el('span', 'Search movies or series'))), group('freevideo-breadcrumb', el('span', 'Home / TV shows / The Last Departure / Episode 1')));
}
function ticketsHeader() {
  return group('site-header', group('tickets-top', mark('tickets'), nav(['Concerts', 'Sports', 'Arts & theatre']), group('ticket-account', icon('user'), el('span', 'My account'))), group('tickets-steps', el('span', '✓ Choose tickets'), el('span', '2  Review your order'), el('span', '3  Checkout')));
}
function recipesHeader() {
  return group('site-header', group('recipes-top', mark('recipes'), group('recipes-search', icon('search'), el('span', 'Find a recipe')), el('span', 'Log in', 'recipes-login')), nav(['Dinners', 'Meals', 'Ingredients', 'Occasions', 'Cuisines', 'Kitchen tips', 'Community'], 'recipes-nav'));
}
function qaHeader() {
  return group('site-header', group('qa-top', mark('qa'), group('qa-nav-icons', icon('home'), icon('bookmark'), icon('message')), group('qa-search', icon('search'), el('span', 'Search Query')), el('span', 'Add question', 'qa-add')));
}
function mailHeader() {
  return group('site-header', group('mail-top', group('mail-brand', el('span', '▰', 'mail-mark'), mark('mail')), group('mail-search', icon('search'), el('span', 'Search mail'), icon('more')), group('mail-account', icon('grid'), el('span', 'AL', 'mail-avatar'))));
}

function product(index, name, price) {
  const thumb = el('div', '', 'product-photo product-' + index);
  thumb.setAttribute('role', 'img'); thumb.setAttribute('aria-label', name);
  return group('catalogue-product', thumb, el('span', name, 'product-name'), el('span', '★★★★☆  (2,418)', 'product-stars'), el('strong', price, 'product-price'), el('span', '✓ prime   FREE delivery', 'product-prime'));
}
function marketScene(variant) {
  const start = variant % products.length;
  const feature = products[start];
  const offers = ['Your everyday. Elevated.', 'Little finds. Big difference.', 'Make yourself at home.', 'Good things for your downtime.'];
  const shelf = [3, 7, 10].map(offset => { const index = (start + offset) % products.length; return product(index, ...products[index]); });
  return group('site-scenery market-scenery', group('market-promo', group('market-promo-copy', el('span', 'A little upgrade goes a long way'), el('h3', offers[Math.floor(variant / 12) % offers.length]), el('span', 'Find your next favourite')), group('market-promo-product', product(start, ...feature))), group('market-shelves', ...shelf));
}
function studioScene() {
  const tiles = [['Ps', 'Photo studio', 'Edit. Retouch. Reimagine.'], ['Ai', 'Vector studio', 'Create at any scale.'], ['Pr', 'Video studio', 'Your story, in motion.'], ['Id', 'Layout studio', 'Give every idea a page.']];
  return group('site-scenery studio-scenery', group('studio-hero', el('span', 'Forma Creative Suite', 'studio-kicker'), el('h3', 'Make something\nthat’s yours.'), el('p', 'The tools you love. All in one place.'), el('span', 'Your Creative Suite membership is active', 'studio-active')), group('creative-apps', ...tiles.map(([abbr, name, copy], i) => group('creative-app app-' + i, el('span', abbr, 'creative-app-icon'), el('strong', name), el('small', copy)))));
}
function harvestScene(variant) {
  const meal = meals[variant % meals.length];
  return group('site-scenery harvest-scenery', image('assets/' + meal.image + '.webp', meal.alt, 'meal-photo'), group('meal-copy', el('span', 'Good food. Good mood.', 'meal-eyebrow'), el('h3', 'Dinner,\nhandled.'), el('p', 'Real ingredients. Recipes worth keeping.'), group('meal-facts', el('span', '◷ ' + meal.minutes + ' min'), el('span', meal.tag), el('span', 'Chef’s choice'))), group('meal-recipe', el('span', 'On your menu this week'), el('strong', meal.name), el('small', meal.detail)));
}
function socialScene(variant) {
  const post = posts[variant % posts.length];
  const stories = ['Your story', ...posts.filter(item => item !== post).map(item => item.user)];
  const storyPhotos = ['post-desk', ...posts.filter(item => item !== post).map(item => item.image)];
  const storyNodes = stories.map((name, i) => {
    const photo = el('div', '', 'story-photo'); photo.style.backgroundImage = `url("${new URL('../assets/' + storyPhotos[i] + '.webp', import.meta.url).href}")`;
    return group('story', photo, el('small', name));
  });
  return group('site-scenery social-scenery', group('social-stories', ...storyNodes), group('social-post', group('post-byline', el('span', post.initial, 'post-avatar'), group('post-author', el('strong', post.user), el('small', post.location)), icon('more')), image('assets/' + post.image + '.webp', post.alt, 'feed-photo'), group('post-toolbar', group('', icon('heart'), icon('message'), icon('share')), icon('bookmark')), el('strong', 'Liked by studiomae and ' + post.likes + ' others', 'post-likes'), el('p', post.user + '  ' + post.caption, 'post-caption')), group('social-suggestions', el('strong', 'Suggested for you'), el('span', 'Discover people who share your interests'), el('span', 'About · Help · Privacy · Terms', 'social-legal')));
}
function astralScene() {
  return group('site-scenery astral-scenery', image('assets/astral-item-cutout.webp', 'A complete celestial astrolabe floating above a midnight starfield', 'astral-art'), group('astral-event-copy', el('span', 'Limited-time invocation', 'astral-event-type'), el('h3', 'Echoes of\nthe Astral Sea'), el('span', '✦ ✦ ✦ ✦ ✦', 'astral-stars'), el('p', 'Every wish leaves a constellation.'), el('span', 'Event ends in 12d 08h', 'astral-countdown')), group('astral-event-tabs', el('span', 'Event wish'), el('span', 'Standard wish'), el('span', 'Wish history')));
}
function softwareScene() {
  return group('site-scenery software-scenery', group('software-breadcrumb', el('span', 'Home › Windows › Utilities › File tools')), group('software-feature', el('span', '↓', 'file-app-icon'), group('file-app-copy', el('span', 'Editor’s pick', 'file-pick'), el('h3', 'Good tools.\nWithout the guesswork.'), el('p', 'Discover trusted downloads for your everyday.'), group('file-badges', el('span', '✓ Verified publisher'), el('span', 'Windows 11 / 10')))), group('software-categories', ...[['◈', 'Security'], ['▦', 'Productivity'], ['↗', 'Browsers'], ['◇', 'Games']].map(([symbol,name]) => group('software-category', el('span', symbol), el('strong', name)))));
}
function streamScene() {
  return group('site-scenery stream-scenery', image('assets/stream.webp', 'A rain-lit elevated railway above a cinematic city at night', 'stream-art'), group('stream-hero-copy', el('span', 'An Afterhours original', 'stream-original'), el('h3', 'THE LAST\nDEPARTURE'), group('stream-rating', el('b', '98% match'), el('span', '16+'), el('span', 'Limited series')), el('p', 'The city never sleeps. Neither does its last secret.')), group('stream-bottom', el('span', 'Because you watched Night Window'), el('span', 'New episodes every Friday')));
}
function fitnessScene() {
  return group('site-scenery fitness-scenery', image('assets/fitness.webp', 'A premium gym with black equipment and warm morning sunlight', 'fitness-art'), group('fitness-hero-copy', el('span', 'Your time. Your pace.', 'fitness-eyebrow'), el('h3', 'SHOW UP\nFOR YOU.'), el('p', 'Space to move. Support to keep going.')), group('fitness-member-card', el('span', 'Alex · Member since 2025'), el('strong', 'PULSE ALL ACCESS'), el('small', 'Home club · Starkville')));
}
function travelScene() {
  return group('site-scenery travel-scenery', group('travel-search', el('span', '⌖ Amalfi Coast, Italy'), el('span', 'Jun 12 — Jun 16'), el('span', '2 adults · 1 room'), el('span', 'Search', 'travel-search-label')), group('travel-property', image('assets/travel.webp', 'A Mediterranean coastal resort with a terrace and sea views', 'travel-photo'), group('travel-property-copy', el('span', 'A little escape, a little closer', 'travel-kicker'), el('h3', 'Somewhere\nworth staying.'), el('p', 'Find your next favourite place.'), group('travel-score', el('b', '9.4'), group('', el('strong', 'Exceptional'), el('small', '1,284 verified reviews'))))), group('travel-benefits', el('span', '✓ Flexible booking options'), el('span', '✓ Real guest reviews'), el('span', '✓ Your next escape')));
}
function arcadeScene() {
  return group('site-scenery arcade-scenery', image('assets/arcade.webp', 'A blue and yellow capsule machine filled with colourful collectible toys', 'arcade-art'), group('arcade-hero-copy', el('span', 'The weekend drop', 'arcade-event'), el('h3', 'A tiny capsule.\nA big little surprise.'), el('p', 'Meet the Cosmic Minis collection.'), group('arcade-rarity', el('span', 'Common'), el('span', 'Rare'), el('span', 'Ultra rare'))), group('arcade-bottom', el('span', 'Series 04'), el('span', '24 to collect · One to discover')));
}
function filehostScene() {
  return group('site-scenery filehost-scenery', group('filehost-file', el('span', 'ZIP', 'filehost-file-icon'), group('filehost-file-copy', el('h3', 'Your files.\nAnywhere you need them.'), el('span', 'Shared securely with MediaDrop'), group('filehost-file-info', el('span', 'Compressed archive'), el('span', '✓ Scanned for threats')))), group('filehost-promo', el('strong', 'More space for what matters.'), el('span', 'Simple sharing. Anywhere access. Files that follow you.')));
}
function freevideoScene() {
  return group('site-scenery freevideo-scenery', group('video-player', image('assets/stream.webp', 'A cinematic city scene from the fictional series The Last Departure', 'video-still'), el('span', '▶', 'video-play-symbol'), group('video-player-tools', el('span', '▶  00:00 / 42:18'), el('span', 'HD  ⚙  ⛶'))), group('video-episode', group('', el('h3', 'The Last Departure'), el('span', 'Season 1 · Episode 1 · The midnight line')), group('video-servers', el('span', 'Server 1'), el('span', 'Server 2'), el('span', 'Server 3'))));
}
function ticketsScene() {
  return group('site-scenery tickets-scenery', group('tickets-event', image('assets/tickets.webp', 'An original concert stage with magenta and blue lighting', 'tickets-art'), group('tickets-event-copy', el('span', 'Live at the Meridian', 'tickets-category'), el('h3', 'Midnight Frequency'), el('p', 'Fri, Jun 12 · 8:00 pm'), el('span', 'Meridian Hall · Starkville, MS'))), group('tickets-summary', group('', el('strong', 'Your night starts here'), el('span', 'Standard admission · Section GA')), group('tickets-verified', icon('lock'), el('span', 'Verified tickets'))));
}
function recipesScene(variant) {
  const choice = variant % (meals.length + 1);
  const meal = choice === meals.length ? { image: 'post-coffee', alt: 'A cafe croissant and latte', category: 'Breakfast & brunch', headline: 'The weekend\ncroissant ritual', copy: 'A slow morning starts with something warm from the oven.', minutes: 30 } : meals[choice];
  return group('site-scenery recipes-scenery', group('recipes-byline', el('span', 'Recipes / ' + meal.category), el('span', 'Kitchen-tested · Community-loved')), group('recipes-feature', group('recipes-feature-copy', el('h3', meal.headline), el('span', '★★★★★  4.8 (286)', 'recipe-rating'), el('p', meal.copy), group('recipe-stats', el('span', 'Prep: 10 mins'), el('span', 'Cook: ' + (meal.minutes - 10) + ' mins'), el('span', 'Serves: 2'))), image('assets/' + meal.image + '.webp', meal.alt, 'recipes-photo')), group('recipe-actions', el('span', 'Save'), el('span', 'Print'), el('span', 'Rate'), el('span', 'Jump to recipe ↓')));
}
function qaScene(variant) {
  const questions = ['Why do free apps ask for so much data?', 'What makes a website feel trustworthy?', 'Why is cancelling a subscription so difficult?'];
  return group('site-scenery qa-scenery', group('qa-topics', el('span', 'Technology'), el('span', 'Privacy'), el('span', 'Everyday questions')), group('qa-answer', group('qa-author', el('span', 'AL', 'qa-avatar'), group('', el('strong', 'Alex Lane'), el('small', 'Software enthusiast · Updated recently'))), el('h3', questions[variant % questions.length]), el('p', 'The short answer is that the business model matters. Some services charge for the product, while others depend on advertising. What happens next depends on the choices the service gives you…'), group('qa-answer-meta', el('span', '↑ 284'), el('span', '32 comments'), el('span', 'Share'))));
}
function mailScene(variant) {
  const subjects = [['Your order is on its way', 'The receipt you asked for', 'A note from your project team'], ['Your weekly reading list', 'Tomorrow’s meeting notes', 'A small account update']][variant % 2];
  return group('site-scenery mail-scenery', group('mail-folders', el('span', '＋ Compose', 'mail-compose'), el('strong', 'Inbox   3'), el('span', 'Starred'), el('span', 'Sent'), el('span', 'Drafts')), group('mail-inbox', group('mail-tabs', el('strong', 'Primary'), el('span', 'Promotions'), el('span', 'Updates')), ...subjects.map((subject, i) => group('mail-message', el('span', '☆', 'mail-star'), group('mail-message-copy', el('strong', ['Parcel', 'Reading Club', 'Alex Lane'][i]), el('span', subject)), el('small', ['10:42','9:18','Yesterday'][i])))));
}
const headers = { market: marketHeader, studio: studioHeader, harvest: harvestHeader, social: socialHeader, astral: astralHeader, software: softwareHeader, stream: streamHeader, fitness: fitnessHeader, travel: travelHeader, arcade: arcadeHeader, filehost: filehostHeader, freevideo: freevideoHeader, tickets: ticketsHeader, recipes: recipesHeader, qa: qaHeader, mail: mailHeader };
const scenes = { market: marketScene, studio: studioScene, harvest: harvestScene, social: socialScene, astral: astralScene, software: softwareScene, stream: streamScene, fitness: fitnessScene, travel: travelScene, arcade: arcadeScene, filehost: filehostScene, freevideo: freevideoScene, tickets: ticketsScene, recipes: recipesScene, qa: qaScene, mail: mailScene };

export function mountSite(root, base, appMode = false, title = '', variant = 0) {
  const definition = BASES[base];
  root.dataset.identity = base;
  root.dataset.surface = appMode ? 'app' : 'web';
  root.dataset.visualVariant = String(variant);
  root.style.setProperty('--site-accent', definition.accent);
  const content = el('div', '', 'site-content');
  const progress = el('span', '', 'task-progress'); progress.hidden = true;
  const task = group('site-task', group('task-location', el('span', base === 'astral' ? 'Exchange / Details' : 'Account / ' + (title || 'Your preferences')), progress, icon('lock')), content);
  const body = group('site-world', scenes[base](variant), task);
  root.append(browser(base, appMode, title), headers[base](), body);
  if (appMode) {
    const names = base === 'astral' ? ['Home', 'Characters', 'Wish', 'Shop'] : base === 'social' ? ['Home', 'Search', 'Create', 'Profile'] : ['Home', 'Explore', 'Orders', 'Account'];
    root.append(group('app-tabbar', ...names.map((name, i) => group('app-tab', icon(['home', 'search', 'grid', 'user'][i]), el('span', name)))), el('div', '', 'home-indicator'));
  } else root.append(group('site-bottomline', el('span', '© ' + definition.name), el('span', 'Privacy   ·   Terms   ·   Help')));
  return { content, identity: base, appMode, progress };
}
