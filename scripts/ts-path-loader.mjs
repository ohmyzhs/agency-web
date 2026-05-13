export async function resolve(specifier, context, defaultResolve) {
  if (specifier === "@/lib/content-intake" || specifier === "../src/lib/content-intake") {
    return defaultResolve(new URL("../src/lib/content-intake.ts", import.meta.url).href, context, defaultResolve);
  }

  return defaultResolve(specifier, context, defaultResolve);
}
