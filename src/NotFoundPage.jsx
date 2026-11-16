import './not-found.css';

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <span className="not-found-kicker">OKZBYTE / 404</span>
      <h1>This page<br /><em>isn’t here.</em></h1>
      <p>The address may be out of date, or the page may have moved.</p>
      <a className="not-found-link" href="/">Return to OkzByte <span aria-hidden="true">↗</span></a>
    </main>
  );
}
