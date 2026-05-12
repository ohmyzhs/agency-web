export function CoupangBanner() {
  return (
    <aside
      aria-label="Sponsored banners"
      className="pointer-events-none fixed right-6 top-28 z-40 hidden xl:block"
    >
      <div className="pointer-events-auto flex flex-col gap-4">
        <iframe
          src="https://coupa.ng/cmRjIv"
          width="120"
          height="240"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          title="Coupang Partners banner 1"
        />
        <iframe
          src="https://coupa.ng/cmRkqN"
          width="120"
          height="240"
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
          title="Coupang Partners banner 2"
        />
      </div>
    </aside>
  );
}
