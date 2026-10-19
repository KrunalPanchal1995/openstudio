// Project figures and videos (paths starting "assets/") are hosted once, on the main site, and referenced from there
// instead of being copied here (they are about 46 MB). Everything else (media/, data/) is local.
export const SITE = "https://krunalpanchal1995.github.io/";

export const asset = (p) => (p && p.startsWith("assets/") ? SITE + p : p);
