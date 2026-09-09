import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'Cheon Minkyeong · 千民京 | Music & Moving Image',
 description: 'Explore music, films and projects by Cheon Minkyeong (千民京). Watch and listen to selected works, Reuben Project and The Four Winds.',
 robots: { index: process.env.GITHUB_PAGES === 'true', follow: process.env.GITHUB_PAGES === 'true' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return <html lang="en" className="dark"><body>{children}</body></html>;
}
