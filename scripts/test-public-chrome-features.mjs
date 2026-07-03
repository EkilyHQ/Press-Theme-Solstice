import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

const layout = read('theme/modules/layout.js');
const interactions = read('theme/modules/interactions.js');
const source = `${layout}\n${interactions}`;
const manifest = JSON.parse(read('theme/theme.json'));
const releaseExample = JSON.parse(read('theme-release.example.json'));

assert.equal(manifest.contractVersion, 3);
assert.equal(manifest.engines.press, '>=3.4.127 <4.0.0');
assert.equal(releaseExample.contractVersion, 3);
assert.equal(releaseExample.engines.press, '>=3.4.127 <4.0.0');
assert.doesNotMatch(source, /href\s*=\s*["']\?tab=posts["']/);
assert.match(layout, /data-site-home/);
assert.match(interactions, /siteFeatureContextEnabled/);
assert.match(interactions, /function getRouter[\s\S]*ctx\.router/);
assert.match(interactions, /function makeRuntimeHref[\s\S]*routerFunction\(params, 'withLangParam'\)/);
assert.match(interactions, /function updateHomeLinks[\s\S]*getHomeSlug[\s\S]*data-site-home/);
assert.match(interactions, /routerFunction\(params, 'searchEnabled'\)/, 'footer search links should use the v3 router search helper');

[
  'visitorThemeControls',
  'footerNav',
  'profileLinks',
  'search',
  'tags',
  'toc',
  'postMeta'
].forEach((key) => {
  assert.match(interactions, new RegExp(`featureEnabled\\([\\s\\S]*['"]${key}['"]`), `${key} should be gated`);
});

assert.match(interactions, /mountThemeControls\(\{ host: panel, variant: 'solstice', themeContext \}\)/);
assert.match(interactions, /setChromeHidden\(search, true\)/);
assert.match(
  interactions,
  /if \(!featureEnabled\(\{ features \}, 'tags'\) \|\| !featureEnabled\(\{ features \}, 'search'\)\) \{/,
  'tag sidebar should hide when either tags or search is disabled'
);
assert.match(layout, /tagBand\.hidden = true;/, 'layout should keep tag band hidden until runtime renders it');
assert.match(
  interactions,
  /featureEnabled\(params, 'tags'\) && featureEnabled\(params, 'search'\) && typeof params\.renderTagSidebar === 'function'/,
  'index enhancement should only render tag sidebar when both tags and search are enabled'
);
assert.match(
  interactions,
  /featureEnabled\(params, 'tags'\) && featureEnabled\(params, 'search'\) && typeof params\.renderTagSidebar === 'function'\) \{[\s\S]*setChromeHidden\(getTagsRegion\(documentRef\), false\);[\s\S]*params\.renderTagSidebar/,
  'index enhancement should unhide tags before delegating tag sidebar rendering'
);
assert.match(
  interactions,
  /else \{[\s\S]*const tags = getTagsRegion\(documentRef\);[\s\S]*tags\.innerHTML = '';[\s\S]*setChromeHidden\(tags, true\);[\s\S]*\}/,
  'index enhancement should clear and hide tags when tags or search are disabled'
);
assert.match(
  interactions,
  /function buildCard\(\{ title, meta, translate, link, siteConfig, features \}\)[\s\S]*const showTags = featureEnabled\(\{ features \}, 'tags'\) && featureEnabled\(\{ features \}, 'search'\);[\s\S]*const tags = showTags && meta \? renderTags\(meta\.tag\) : ''/,
  'index/search cards should hide tags when tags or search are disabled'
);
assert.match(
  interactions,
  /function buildCard\(\{ title, meta, translate, link, siteConfig, features \}\)[\s\S]*const showPostMeta = featureEnabled\(\{ features \}, 'postMeta'\);[\s\S]*const date = showPostMeta && meta && meta\.date \? formatDisplayDate\(meta\.date\) : '';/,
  'index/search cards should hide date metadata when postMeta is disabled'
);
assert.match(
  interactions,
  /const showPostMeta = featureEnabled\(\{ features \}, 'postMeta'\);[\s\S]*const date = showPostMeta && postMetadata && postMetadata\.date/,
  'post date line should respect postMeta'
);
assert.match(
  interactions,
  /const showTags = featureEnabled\(\{ features \}, 'tags'\) && featureEnabled\(\{ features \}, 'search'\);[\s\S]*renderPostMetaCard\(title, postMetadata \|\| \{\}, markdown, \{ showTags \}\)/,
  'shared post meta card should receive the tags and search feature gates'
);
assert.match(
  interactions,
  /if \(!featureEnabled\(\{ features \}, 'toc'\)\) \{[\s\S]*clearSolsticeToc\(toc\);[\s\S]*toc\.hidden = true;/,
  'static tab TOC should respect toc'
);
assert.match(
  interactions,
  /function updateHomeLinks[\s\S]*routerFunction\(params, 'getHomeSlug'\)[\s\S]*__press_get_home_slug[\s\S]*if \(!homeSlug\) return false;[\s\S]*makeRuntimeHref\(params, `\?tab=\$\{encodeURIComponent\(homeSlug\)\}`\);/,
  'identity refresh should prefer ctx.router home helpers or preserve existing home hrefs'
);
assert.match(
  interactions,
  /function renderNavLinks[\s\S]*routerFunction\(params, 'getHomeSlug'\)[\s\S]*routerFunction\(params, 'postsEnabled'\)[\s\S]*updateHomeLinks\(nav\.ownerDocument \|\| defaultDocument, \{ \.\.\.params, getHomeSlug: \(\) => homeSlug \}\);/,
  'nav rendering should prefer ctx.router home/posts helpers before updating home links'
);
assert.match(
  interactions,
  /const column = root\.closest \? root\.closest\('\[data-footer-column="nav"\]'\) : null;[\s\S]*setChromeHidden\(column, true\);[\s\S]*setChromeHidden\(column, false\);/,
  'footerNav=false should hide and restore the whole footer nav column'
);

console.log('ok - Solstice public chrome feature gates');
