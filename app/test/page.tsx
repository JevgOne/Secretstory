import '../test-simple.css';

export default function TestPage() {
  return (
    <div>
      <nav>TEST NAVIGATION - This should have grey background</nav>
      <section className="hero">
        <h1>TEST HERO - Black background, white text</h1>
        <p>If you see black background, CSS works!</p>
      </section>
    </div>
  );
}
