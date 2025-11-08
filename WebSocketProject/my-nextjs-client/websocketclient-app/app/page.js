import Link from 'next/link';
import styles from './Homepage.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to the Project</h1>
        <p className={styles.description}>
          This is the homepage. The WebSocket client has been moved to its own dedicated page.
        </p>
        <Link href="/websocket-demo" className={styles.linkButton}>
          Go to WebSocket Demo
        </Link>
      </div>
    </main>
  );
}